import { createClient } from "@supabase/supabase-js";
import { supabase } from "../config/supabase.js";

/* Admin: Issue certificate */

export const issueCertificate=async (req,res) => {
    try {
        const {event_registration_id, certificate_url, certificate_type}=req.body;

        // Validate input
    if (!event_registration_id) {
      return res.status(400).json({ error: 'event_registration_id is required' });
    }
       
        // Get registration details
    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .select('event_id, user_id, status')
      .eq('id', event_registration_id)
      .single();

      if(regError) throw regError;

      // Check if registration is approved
    if (registration.status !== 'approved') {
      return res.status(400).json({ 
        error: 'Can only issue certificates for approved registrations',
        current_status: registration.status
      });
    }

      // generate certificate number
      const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase();
      const certificateNumber= `CERT-${new Date().getFullYear()}-${timestamp}-${randomPart}`;

      // Check if certificate already exists
    const { data: existing } = await supabase
      .from('certificates')
      .select('id')
      .eq('event_id', registration.event_id)
      .eq('user_id', registration.user_id)
      .eq('certificate_type', certificate_type || 'participation')
      .single();

    if (existing) {
      return res.status(409).json({ 
        error: 'Certificate already exists for this user, event, and type',
        certificate_id: existing.id
      });
    }

      // insert certificate
        const{data,error}=await supabase
        .from("certificates")
        .insert({
         event_id: registration.event_id,
        user_id: registration.user_id,
        registration_id: event_registration_id,
        certificate_type: certificate_type || 'participation',
        certificate_number: certificateNumber,
        file_url: certificate_url,
        issued_by: req.admin?.id || req.user?.id,
        issued_at: new Date().toISOString(),  
        })
        .select()
        .single();

        if (error) {
      console.error(`[CERT_ISSUE_DB_ERROR] Code: ${error.code} | Message: ${error.message}`);
      throw error;
    }
    console.log(`[CERT_ISSUE_SUCCESS] Certificate ID: ${data.id} issued by Admin: ${req.admin?.id}`);

        res.status(201).json({
            message:'Certificate issued successfully',
            certificate: data,
        });
    } catch (err) {
        console.error(`[CERT_ISSUE_CRITICAL] Internal Server Error:`, err.stack || err);
        res.status(500).json({error: err.message});
    }
    
};

/* Admin: View all certificates */
export const getAllCertificates=async(req,res)=>{
    try {
        const {data,error}=await supabase
        .from('certificate_view')
        .select('*')
        .order("issued_at",{ascending: false});

        if (error) {
      console.error(`[GET_ALL_CERTS_DB_ERROR] Code: ${error.code} | Message: ${error.message}`);
      throw error;
    }
        res.json(data);
    } catch (err) {
        console.error(`[GET_ALL_CERTS_CRITICAL]`, err.stack || err);
        res.status(500).json({error: err.message});
    }
};

/* User: View own certificates
RLS enforces auth.uid()=user_id
*/

export const getMyCertificates=async (req,res) => {
    try {
        const authHeader=req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({error: "Missing token"});
        }

        const token = authHeader.replace("Bearer ", "");

        // pass user JWT to supabase so RLS works
        // This ensures RLS policies are enforced correctly

        const userSupabase= createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY,
            {
                global:{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            }
        );

        // Verify the token and get user
    const { data: { user }, error: authError } = await userSupabase.auth.getUser(token);

    if (authError || !user) {
      console.error('[GET_MY_CERTS_AUTH_ERROR]', authError);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Fetch certificates - RLS will automatically filter by user_id
    const { data, error } = await userSupabase
      .from("certificates")
      .select(`
        id,
        certificate_number,
        certificate_type,
        issued_at,
        file_url,
        event_id,
        events!inner(
          title,
          event_date
        )
      `)
      .order('issued_at', { ascending: false });

      if (error) {
      console.error('[GET_MY_CERTS_DB_ERROR]', error);
      throw error;
    }

    // Format the response
    const formattedCerts = data.map(cert => ({
      id: cert.id,
      certificate_number: cert.certificate_number,
      certificate_type: cert.certificate_type,
      issued_at: cert.issued_at,
      file_url: cert.file_url,
      event_title: cert.events?.title,
      event_date: cert.events?.event_date
    }));

    res.json(formattedCerts);
  } catch (err) {
    console.error('[GET_MY_CERTS_CRITICAL]', err);
    res.status(500).json({ error: err.message || 'Failed to fetch your certificates' });
  }    
};

export const getCertificateTypes=async (req,res) => {
    try {
        const {data, error}=await supabase
        .from("certificate_types")
        .select("id, name, description")
        .order("name", {ascending: true});

        if(error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Error fetching certificate types:',err);
        res.status(500).json({ error: err.message });
        
    }
    
};