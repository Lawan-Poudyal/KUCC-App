import { supabase } from "../config/supabase.js";
import {v4 as uuidv4} from 'uuid';

// login function
export const loginAdmin=async (req,res) => {
    const {email,password}=req.body;

    try {
        //1. Supabase auth sign-in
        const {data:authData, error:authError}=await supabase.auth.signInWithPassword({email,password});
        if(authError) return res.status(401).json({error:authError.message});

        const userId=authData.user.id;
        console.log('User ID:', userId);

        //2. check admin table
        const {data: adminData, error: adminError}=await supabase
        .from('admins')
        .select('*')
        .eq('id',userId)
        .single();

        if(adminError || !adminData){
            await supabase.auth.signOut();
            return res.status(403).json({error:'Access denied.You are not an admin'});
        }

        if(!adminData.is_active){
            await supabase.auth.signOut();
            return res.status(403).json({error:'Admin account is disabled.'});
        }

        // 3. Success
        return res.json({
            success: true,
            session: authData.session,  // this is the Supabase session
            role: adminData.role
        });
    
    } catch (error) {
        console.error('Error during admin login:', error);
        return res.status(500).json({error:'Internal server error'});
        
    }
    
};

