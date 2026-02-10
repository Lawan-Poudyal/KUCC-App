import { supabase } from "../config/supabase.js";

export const masterAccess = async (req, res) => {
  res.json({
    success: true,
    role: req.admin.role,
    message: 'Master access granted',
  });
};

/**
 * Get all admins
 * (master-only responsibility)
 */
export const getAllAdmins = async (req, res) => {

  console.log(" GET /admins called");
  console.log("Authenticated admin:", req.admin);
  try{
  const { data, error,status } = await supabase
    .from('admins')
    .select('id, email, full_name, role, is_active, created_at')
    .order('created_at', { ascending: false });

    console.log("Supabase status:", status);
    console.log("Supabase error:", error);
    console.log("Supabase data:", data);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

   // Important: distinguish empty data vs failure
    if (!data || data.length === 0) {
      return res.status(200).json({
        message: "No admins found",
        data: [],
      });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected server error:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

/**
 * Change admin role or status
 */
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { role, is_active } = req.body;

  // Prevent admin from deactivating themselves
  if (id === req.admin.id && is_active === false) {
    return res.status(400).json({ 
      error: "You cannot deactivate your own account" 
    });
  }



  const { error } = await supabase
    .from('admins')
    .update({ role, is_active })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ success: true });
};

export const createAdmin=async (req,res) => {
  const {email,full_name,role,password}=req.body;

  try {
     // Validate inputs
    if (!email || !full_name || !role || !password) {
      return res.status(400).json({ 
        error: "Email, full name, role, and password are required" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters long" 
      });
    }

    if (!['editor', 'master'].includes(role)) {
      return res.status(400).json({ 
        error: "Role must be either 'editor' or 'master'" 
      });
    }


    // create auth user
    const {data: authUser, error: authError} = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
       user_metadata: {
        full_name,
        role,
      }
    });

    if(authError){
       console.error("Auth creation error:", authError);
      return res.status(400).json({error:authError.message});
    }

    const userId=authUser.user.id;
    console.log("Auth user created with ID:", userId);


    // insert into admins table
    const {data,error}=await supabase.from('admins').insert({
      id: userId,
      email,
      full_name,
      role,
      is_active: true,
  })
  .select()
  .single();
  
    if(error){
        console.error("Admins table insert error:", error);
        // Try to delete the auth user if admin insert fails
      await supabase.auth.admin.deleteUser(userId);
     
      return res.status(400).json({error:error.message});
    }
    console.log("Admin created successfully:", data);
    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: data
    });

  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** * Delete admin permanently
 * (master-only responsibility)
 */
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    // Prevent admin from deleting themselves
    if (id === req.admin.id) {
      return res.status(400).json({ 
        error: "You cannot delete your own account" 
      });
    } 
    // First, delete from admins table
    const { error: adminDeleteError } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

      if (adminDeleteError) {
      console.error("Admin table delete error:", adminDeleteError);
      return res.status(500).json({ error: adminDeleteError.message });
    }

    // Then, delete the auth user (this will cascade delete due to foreign key)
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(id);
    if (authDeleteError) {
      console.error("Auth user delete error:", authDeleteError);
      return res.status(500).json({ 
        error: "Admin record deleted but auth user deletion failed: " + authDeleteError.message 
      });
    }
     console.log("Admin deleted successfully:", id);
    res.json({ 
      success: true,
      message: "Admin deleted successfully"
    });
  }catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

