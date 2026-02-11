import React, { useState } from 'react'
import StepEvent from './StepEvent';
import TypeCertificate from './TypeCertificate';
import RecipientSelection from './RecipientSelection';
import ReviewStep from './ReviewStep';
import CertificateView from './CertificateView';
import CertificateSuccessToast from './CertificateSuccessToast';
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCertificateTypes, getEventRegistrations, getEvents, issueCertificates } from '../services/certificateService.js';


const CertificateGenerator = () => {
const [currentStep, setCurrentStep]= useState(1);
const [formData, setFormData]= useState({
    selectedEvent: null,
    certificateType: null,
    selectedRecipients:[] //  These will be registration IDs
});

const [events, setEvents]=useState([]);
const [recipients, setRecipients]=useState([]);
const [certificateTypes,setCertificateTypes]=useState([]);
const [loading,setLoading]=useState(false);
const [error,setError]=useState(null);
const [user, setUser]=useState(null);

// Success modal state
const [showSuccessModal, setShowSuccessModal] = useState(false);
const [generationResults, setGenerationResults] = useState({
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0
});

// check authentication on mount
useEffect(()=>{
    checkAuth();
    fetchInitialData();

    const {data: {subscription}}= supabase.auth.onAuthStateChange(
         (_event, session) => {
        setUser(session?.user ?? null);
         }
    );

    return ()=> subscription.unsubscribe();

},[]);

// fetch recipients when event changes
useEffect(()=>{
    if(formData.selectedEvent?.id){
    fetchEventRegistrations(formData.selectedEvent.id);
    }
},[formData.selectedEvent]);

const checkAuth=async () => {
    const {data : {session}}= await supabase.auth.getSession();
    setUser(session?.user ?? null);
};

const fetchInitialData=async () => {
    try {
        setLoading(true);
        const [eventsData, typesData]=await Promise.all([
            getEvents(),
            getCertificateTypes()
        ]);
        setEvents(eventsData);
        setCertificateTypes(typesData);
    } catch (err) {
        setError('Failed to load initial data:' + err.message);
        console.error(err);
    }finally{
        setLoading(false);
    }
};

const fetchEventRegistrations=async (eventId) => {
    try {
        setLoading(true);
        const data=await getEventRegistrations(eventId);
        setRecipients(data);

        // reset selected recipients when event changes
        setFormData(prev => ({
            ...prev,
            selectedRecipients: []
        }));
    } catch (err) {
        setError('Failed to load recipients:' + err.message);
        console.error(err);
    }finally{
        setLoading(false);
    }
};

 const handleGenerateCertificates=async () => {
    try {
        setLoading(true);
        setError(null);

        console.log('Generating certificates for registration IDs:', formData.selectedRecipients);
        console.log('Certificate type:', formData.certificateType?.id);

        const totalRecipients = formData.selectedRecipients.length;

        // generate certificates using registration IDs
        const results=await Promise.allSettled( // handles multiple async operations simultaneously better than Promise.all
            formData.selectedRecipients.map(async (registrationId) => {
                // generate actual PDF and upload to storage
                const certificateUrl= `https://storage.example.com/certificates/${registrationId}.pdf`;

                return issueCertificates({
                    event_registration_id: registrationId,
                    certificate_url: certificateUrl,
                    certificate_type: formData.certificateType?.id || 'participation'
                });
            })
        );

        const failed=results.filter(r => r.status=== 'rejected');
        const succeeded = results.filter(r => r.status === 'fulfilled');

        // Check for skipped certificates
        const skipped = succeeded.filter(r => r.value?.skipped).length;
        const newlyCreated = succeeded.length - skipped;

        // Update generation results for modal
        setGenerationResults({
          total: totalRecipients,
          success: newlyCreated,
          failed: failed.length,
          skipped: skipped
        });

        if(failed.length > 0){
            console.error('Some certificates failed:', failed);
            const failedReasons = failed.map(f => f.reason?.message || 'Unknown error').join('; ');

            if(newlyCreated > 0 || skipped > 0){
                let msg=[];
                if(newlyCreated > 0) msg.push(`${newlyCreated} new certificate(s) created`);
                if(skipped > 0) msg.push(`${skipped} already existed`);
                if(failed.length > 0) msg.push(`${failed.length} failed: ${failedReasons}`);
                setError(msg.join('. '));
            }else{
                setError(`All certificates failed: ${failedReasons}`);
                return; // Don't proceed to success view if all failed
            }
        }else if (skipped > 0) {
            setError(`${newlyCreated} new certificate(s) created, ${skipped} already existed (skipped)`);
        }
        
        // Show success modal
        setShowSuccessModal(true);
        
        // Move to success view
        setCurrentStep(5);

    } catch (err) {
        setError('Failed to generate certificates:' + err.message);
        console.error(err);
    }finally{
        setLoading(false);
    }
 };

const next=()=> setCurrentStep((s)=> s+1);
const back=()=> setCurrentStep((s)=> s-1);

const handleCloseSuccessModal = () => {
  setShowSuccessModal(false);
};

// show loading on initial load
if(loading && currentStep === 1 && events.length === 0){
    return(
        <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
}

// check if user is authenticated
if(!user){
    return (
     <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please login to access certificate generation.</p>
        </div>
      </div>   
    );
}

return(
    <div className='max-w-3xl mx-auto p-6'>

        {/*Error display */}
        {error && (
            <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
                {error}
                <button onClick={()=> setError(null)}
                className='float-right font-bold'
                >
                   ×  
                </button>
            </div>
        )}

        {/* Success Toast */}
        <CertificateSuccessToast
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          successCount={generationResults.success}
        />

        {/*Step Components */}
        {currentStep === 1 && (
            <StepEvent
             formData={formData}
              setFormData={setFormData}
               onNext={next}
               events={events}
               loading={loading}
               />
        )}

        {currentStep === 2 && (
            <TypeCertificate 
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            certificateTypes={certificateTypes}
            />
        )}

        {currentStep === 3 && (
            <RecipientSelection
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            recipients={recipients}
            loading={loading}
            />
        )}

        {currentStep === 4 && (
            <ReviewStep
            formData={formData}
            onNext={handleGenerateCertificates}
            onBack={back}
            recipients={recipients}
            loading={loading}
            />
        )}

        {currentStep === 5 && (
            <CertificateView
             formData={formData}
             recipients={recipients}
             />

        )
        }
    </div>
);
};

export default CertificateGenerator;