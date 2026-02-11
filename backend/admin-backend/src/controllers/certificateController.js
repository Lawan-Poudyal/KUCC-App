import { createClient } from "@supabase/supabase-js";
import { supabase } from "../config/supabase.js";
import { sendCertificateEmail } from "../../utils/mailer.js";
import  path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { generateCertificatePDF } from "../../utils/certificatepdfgenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Ensure certificates directory exists
const CERTIFICATES_DIR = path.join(__dirname, '../../certificates');
if (!fs.existsSync(CERTIFICATES_DIR)) {
  fs.mkdirSync(CERTIFICATES_DIR, { recursive: true });
}

/* Admin: Issue certificate with pdf generation */

export const issueCertificate = async (req, res) => {
  try {
    console.log('[CERT_ISSUE] Request body:', req.body);
    console.log('[CERT_ISSUE] Admin:', req.admin?.id);

    const { event_registration_id, certificate_url, certificate_type } = req.body;

    // Validate input
    if (!event_registration_id) {
      console.error('[CERT_ISSUE] Missing event_registration_id');
      return res.status(400).json({ error: 'event_registration_id is required' });
    }

    console.log('[CERT_ISSUE] Fetching registration:', event_registration_id);

    // Get registration details with proper joins
    const { data: registration, error: regError } = await supabase
      .from('event_registrations')
      .select(`
        id,
        event_id,
        user_id,
        status,
        users!event_registrations_user_id_fkey (
          id,
          email,
          name
        ),
        events!event_registrations_event_id_fkey (
          id,
          title
        )
      `)
      .eq('id', event_registration_id)
      .single();

    if (regError) {
      console.error('[CERT_ISSUE_REG_ERROR]', regError);
      return res.status(400).json({ error: `Registration not found: ${regError.message}` });
    }

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    console.log('[CERT_ISSUE] Registration found:', {
      event_id: registration.event_id,
      user_id: registration.user_id,
      status: registration.status
    });

    // Check if registration is approved
    if (registration.status !== 'approved') {
      return res.status(400).json({
        error: 'Can only issue certificates for approved registrations',
        current_status: registration.status
      });
    }

    // Check if certificate already exists
    const { data: existing, error: existingError } = await supabase
      .from('certificates')
      .select('id, certificate_number')
      .eq('event_id', registration.event_id)
      .eq('user_id', registration.user_id)
      .eq('certificate_type', certificate_type || 'participation')
      .maybeSingle();

    if (existingError) {
      console.error('[CERT_CHECK_ERROR]', existingError);
    }

    if (existing) {
      console.log(`[CERT_SKIP] Certificate already exists: ${existing.id}`);
      // IMPORTANT: Return here to stop execution
      return res.status(200).json({
        message: 'Certificate already exists (skipped)',
        certificate: existing,
        skipped: true
      });
    }

    // Generate certificate number
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substr(2, 5).toUpperCase();
    const certificateNumber = `CERT-${new Date().getFullYear()}-${timestamp}-${randomPart}`;

    console.log('[CERT_ISSUE] Creating new certificate:', certificateNumber);

    // Generate PDF
    const filename = `${certificateNumber}.pdf`;
    const outputPath = path.join(CERTIFICATES_DIR, filename);

    try {
      await generateCertificatePDF({
        recipientName:registration.users?.name || 'Participant',
        eventTitle: registration.events?.title || 'Event',
      certificateType: certificate_type || 'participation',
      certificateNumber: certificateNumber,
      issueDate: new Date().toLocaleDateString('en-US',{
        year: 'numeric',
          month: 'long',
          day: 'numeric'
      }),
      outputPath: outputPath
      });
      console.log('[PDF_SUCCESS] PDF generated successfully');
    } catch (pdfError) {
       console.error('[PDF_ERROR] Failed to generate PDF:', pdfError);
      return res.status(500).json({ error: 'Failed to generate certificate PDF: ' + pdfError.message });
      
    }

     // Certificate URL (local path )
    const certificateUrl = `/certificates/${filename}`;

    // Insert certificate
    const { data: certificate, error } = await supabase
      .from('certificates')
      .insert({
        event_id: registration.event_id,
        user_id: registration.user_id,
        registration_id: event_registration_id,
        certificate_type: certificate_type || 'participation',
        certificate_number: certificateNumber,
        file_url: certificateUrl,
        issued_by: req.admin?.id || null,
        issued_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error(`[CERT_ISSUE_DB_ERROR] Code: ${error.code} | Message: ${error.message}`);
      console.error(`[CERT_ISSUE_DB_ERROR] Details:`, error.details);
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    console.log(`[CERT_ISSUE_SUCCESS] Certificate ID: ${certificate.id} issued by Admin: ${req.admin?.id}`);

    /* Send certificate email (NON-BLOCKING) */
    try {
       // Use full URL for email
      const fullUrl = `${req.protocol}://${req.get('host')}${certificateUrl}`;
      await sendCertificateEmail({
        to: registration.users?.email,
        name: registration.users?.name || 'Participant',
        eventTitle: registration.events?.title || 'Event',
        certificateType: certificate_type || 'participation',
        pdfUrl: fullUrl,
      });
      console.log(`[CERT_EMAIL_SUCCESS] Sent to ${registration.users?.email}`);
    } catch (emailErr) {
      console.error(`[CERT_EMAIL_FAILED] Email failed for ${registration.users?.email}:`, emailErr.message);
      // Don't fail the request if email fails
    }

    // Final response
    return res.status(201).json({
      message: 'Certificate issued successfully',
      certificate,
    });
    
  } catch (err) {
    console.error(`[CERT_ISSUE_CRITICAL] Internal Server Error:`, err.stack || err);
    
    // Check if response was already sent
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message || 'Failed to issue certificate' });
    }
  }
};

/*Download certificate PDF */
export const downloadCertificate=async (req,res) => {
  try{
    const {certificateId}=req.params;
 // Fetch certificate from database
    const { data: certificate, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', certificateId)
      .single();

      
    if (error || !certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Extract filename from URL
    const filename = path.basename(certificate.file_url);
    const filepath = path.join(CERTIFICATES_DIR, filename);
     // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Certificate file not found' });
    }

    
    // Send file
    res.download(filepath, filename, (err) => {
      if (err) {
        console.error('[DOWNLOAD_ERROR]', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download certificate' });
        }
      }
    });

  }catch(error){
      console.error('[DOWNLOAD_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

/* Get certificates for a specific registration */
export const getCertificatesByRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;

    const { data: certificates, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('registration_id', registrationId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ certificates: certificates || [] });

  } catch (error) {
    console.error('[GET_CERTS_ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};


/* Admin: View all certificates */
export const getAllCertificates=async(req,res)=>{
    try {
        const {data,error}=await supabase
        .from('certificate_view')
        .select(`
           id,
        certificate_number,
        certificate_type,
        issued_at,
        file_url,
        issued_by,
        events(title, event_date),
        users(name, email)
          `)
        .order("issued_at",{ascending: false});

        if (error) {
      console.error(`[GET_ALL_CERTS_DB_ERROR] Code: ${error.code} | Message: ${error.message}`);
      throw error;
    }

    // format response
    const formatted= data.map(cert=> ({
      id:cert.id,
      certificate_number:cert.certificate_number,
      certificate_type:cert.certificate_type,
      issued_at: cert.issued_at,
      file_url: cert.file_url,
      issued_by: cert.issued_by,
      event_title:cert.events?.title,
      event_date: cert.events?.event_date,
      user_name: cert.users?.full_name,
      user_email:cert.users?.email,
    }));
        res.json(formatted);
    } catch (err) {
        console.error(`[GET_ALL_CERTS_CRITICAL]`, err.stack || err);
        res.status(500).json({error: err.message});
    }
};

/* User: View own certificates
RLS enforces 
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
        events(
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
      event_date: cert.events?.event_date,
    }));

    res.json(formattedCerts);
  } catch (err) {
    console.error('[GET_MY_CERTS_CRITICAL]', err);
    res.status(500).json({ error: err.message || 'Failed to fetch your certificates' });
  }    
};

// Admin and User: get certificate types

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