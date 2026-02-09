import 'dotenv/config';
import express from 'express';
import {
  clerkMiddleware,
  requireAuth,
  getAuth,
  clerkClient,
} from '@clerk/express';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase with SERVICE ROLE key (backend only)
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key, NOT anon key
);

// Middleware
app.use(express.json());
app.use(clerkMiddleware());

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

app.get('/', (req, res) => {
  res.json({ message: 'KUCC Backend API with Clerk Auth' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// PROTECTED ROUTES (Require authentication)
// ============================================

// Get current user profile
app.get('/api/user/profile', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    // Get user from Clerk
    const user = await clerkClient.users.getUser(userId);

    // Optionally, fetch additional user data from Supabase
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = not found, which is okay for new users
      console.error('Supabase error:', error);
    }

    res.json({
      clerk: {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.unsafeMetadata?.name,
        phone: user.unsafeMetadata?.phone,
      },
      database: userData || null,
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Create or update user in Supabase
app.post('/api/user/sync', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const user = await clerkClient.users.getUser(userId);

    const userData = {
      clerk_user_id: userId,
      email: user.primaryEmailAddress?.emailAddress,
      name: user.unsafeMetadata?.name,
      phone: user.unsafeMetadata?.phone,
      updated_at: new Date().toISOString(),
    };

    // Upsert user data in Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'clerk_user_id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      return res.status(500).json({ error: 'Failed to sync user data' });
    }
    console.log('✅ User synced to Supabase:', data);

    res.json({ success: true, user: data });
  } catch (err) {
    console.error('Error syncing user:', err);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Example: Get user-specific data from Supabase
app.get('/api/data/my-items', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);

    // Query Supabase using the verified Clerk user ID
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch items' });
    }

    res.json({ items: data });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// Example: Create new item in Supabase
app.post('/api/data/items', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          user_id: userId,
          title,
          description,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to create item' });
    }

    res.json({ success: true, item: data });
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================

// listen on all interfaces (allows network acccess)
app.listen(PORT,'0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ Clerk authentication enabled`);
  console.log(`✅ Supabase connected with service role key`);
});

export default app;
