import { supabase } from "../config/supabase.js";
export const requireAdmin = (roles = []) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    // RETRY LOGIC FOR NETWORK ISSUES
    let retries = 3;
    let userData = null;
    let userError = null;

    while (retries > 0) {
      try {
        const result = await supabase.auth.getUser(token);
        userData = result.data;
        userError = result.error;
        break; // Success, exit retry loop
      } catch (err) {
        console.error(`[AUTH] Supabase connection attempt failed (${4 - retries}/3):`, err.message);

        // Check if it's a timeout/network error
        if (err.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || err.code === 'ETIMEDOUT') {
          retries--;
          if (retries > 0) {
            console.log(`[AUTH] Retrying in 1 second... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        }
        
        // Provide helpful error message
        if (err.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
          return res.status(503).json({
            error: 'Service temporarily unavailable',
            details: 'Cannot connect to authentication service. Please check your internet connection.'
          });
        }

        throw err;
      }
    }

    // All retries exhausted
    if (!userData?.user) {
      console.error('[AUTH] Failed to verify token after retries');
      return res.status(401).json({
        error: 'Invalid token',
        details: 'Unable to verify authentication. Please try again.'
      });
    }
    
    if (userError) {
      console.error('[AUTH] User error:', userError);
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = userData.user.id;
    console.log('User ID:', userId);

    // check admin table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('*')
      .eq('id', userId)
      .single();

    if (adminError) {
      console.error('[AUTH] Admin lookup error:', adminError);
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!adminData || !adminData.is_active) {
      console.error('[AUTH] Admin not found or inactive');
      return res.status(403).json({ error: 'Access denied' });
    }

    if (roles.length && !roles.includes(adminData.role)) {
      console.error('[AUTH] Insufficient role:', adminData.role, 'Required:', roles);
      return res.status(403).json({ error: 'Insufficient privileges' });
    }

    // attach to request
    req.admin = adminData;
    req.userId = userId;  // for notification
    console.log('✓ Admin authenticated:', adminData.email, '(', adminData.role, ')');

    next();
  } catch (err) {
    console.error('[AUTH] Critical error in requireAdmin middleware:', err);
    
    // Provide helpful error message for network issues
    if (err.cause?.code === 'UND_ERR_CONNECT_TIMEOUT') {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        details: 'Cannot connect to authentication service. Please check your internet connection.'
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};