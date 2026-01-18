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
  const {email,full_name,role}=req.body;

  try {
    // create auth user
    const {data: authUser, error: authError} = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

    if(authError){
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
  });
  
    if(error){
      return res.status(400).json({error:error.message});
    }
    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating admin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
