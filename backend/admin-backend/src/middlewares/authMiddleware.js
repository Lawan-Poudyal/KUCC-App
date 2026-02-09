
import { supabase } from "../config/supabase.js";

export const requireAdmin=(roles=[])=> async (req,res,next) => {

   
try {
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return  res.status(401).json({error:'Not authenticated'});
    }

    const token= authHeader.replace('Bearer ','');

    // verify JWT
    const{data: userData, error: userError}= 
    await supabase.auth.getUser(token);

    if(userError || !userData?.user){
        return res.status(401).json({error:'Invalid token'});
    }

    const userId=userData.user.id;
    console.log('User ID:', userId);

// check admin table
    const {data:adminData, error: adminError}= await supabase
    .from('admins')
    .select('*')
    .eq('id',userId)
    .single();

    if(adminError || !adminData || !adminData.is_active){
        return res.status(403).json({error:'Access denied'});
    }

    if(roles.length && !roles.includes(adminData.role)){
        return res.status(403).json({error:'Insufficient privileges'});
    }

    // attach to request
    req.admin=adminData;
    console.log('Admin authenticated:', adminData);
    
    req.userId=userId;  // for notification
    
    next();
} catch (err) {
    console.error('Error in requireAdmin middleware:', err);
    res.status(500).json({error:'Internal server error'});
}
    
};