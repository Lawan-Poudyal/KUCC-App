import React, { useEffect, useState } from 'react';
import { downloadCertificate, getCertificatesByRegistration } from '../services/certificateService.js';


const CertificateView = ({formData, recipients=[]}) => {

    const [certificates, setCertificates]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error, setError]=useState(null);

    //  Get the first selected recipient from the recipients array
    const selectedRecipientIds = formData.selectedRecipients || [];
    const firstRecipientId = selectedRecipientIds[0];
    const recipient = recipients.find(r => r.id === firstRecipientId);
    

    //certificate data fro preview
    const certificateData={
        organization :'KATHMANDU UNIVERSITY COMPUTER CLUB',
        certificateType: formData.certificateType?.name || 'CERTIFICATE OF PARTICIPATION',
       recipientName: recipient?.name || 'Recipient Name',
        eventName: formData.selectedEvent?.name ||  formData.selectedEvent?.title || 'Event Name',
        eventDate: formData.selectedEvent?.date || formData.selectedEvent?.event_date || 'Event Date',
        eventCoordinator:'Event Coordinator',
        president: 'KUCC President',
        certificateId: 'CERT-2025-GIT-03'
    };

    useEffect(()=>{
        fetchCertificates();
    },[]);

    const fetchCertificates=async () => {
        try{
            setLoading(true);
            setError(null);

            // fetch certificates for all selected recipients
            const certPromises=formData.selectedRecipients.map(regId =>
                getCertificatesByRegistration(regId)
            );

            const certResults= await Promise.allSettled(certPromises);

            // Flatten and filter successful results
      const allCerts = certResults
        .filter(r => r.status === 'fulfilled' && r.value && r.value.length > 0)
        .flatMap(r => r.value);

      setCertificates(allCerts);

        }catch(err){
          console.error('Error fetching certificates:', err);
      setError('Failed to load certificates: ' + err.message);  
        }finally{
            setLoading(false);
        }
    };

    const handleDownload=(certificateId, certificateNumber)=>{
        try {
            downloadCertificate(certificateId);
        } catch (err) {
            console.error('Download error:',err);
            alert('Failed to download certificate. Please try again.');
            
        }
    };

    const handleDownloadAll = () => {
    certificates.forEach((cert, index) => {
      setTimeout(() => {
        handleDownload(cert.id, cert.certificate_number);
      }, index * 500); // Stagger downloads by 500ms
    });
  };


    

  return (
   <div className='min-h-screen bg-gray-200 p-8 flex items-center justify-center'>
    <div className='w-full max-w-2xl space-y-6'>

        {/*Certificate Card */}
        <div className='bg-white rounded-3xl p-8 shadow-lg'>
            {/*Certificate Border Frame */}
            <div className='border-4 border-indigo-900 rounded-2xl p-8 relative'>
                {/*Inner Border */}
                <div className='border-2 border-indigo-900 rounded-xl p-8'>
                    {/*Logo */}
                    <div className='flex justify-center mb-4'>
                        <div className='w-16 h-16 bg-indigo-900 rounded-full flex items-center justify-center'>
                            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                        </div>
                    </div>

                    {/*Organization Name */}
                    <h3 className='text-center text-xs font-bold text-gray-900 mb-6 tracking-wide'>
                        {certificateData.organization}
                    </h3>

                    {/*Certificate Type */}
                    <h2 className='text-center text-sm font-bold text-gray-900 mb-4'>
                        {certificateData.certificateType}
                    </h2>

                    {/*Certification Text */}
                    <p className='text-center text-xs text-gray-600 mb-3'>
                        This is to certify that
                    </p>

                    {/*Recipient Name */}
                    <h1 className='text-center text-2xl font-bold text-indigo-900 mb-4'>
                        {certificateData.recipientName}
                    </h1>

                    {/*Participation text */}
                    <p className='text-center text-xs text-gray-600 mb-3'>
                        has successfully participated in
                    </p>

                    {/*Event Name */}
                    <h2 className='text-center text-lg font-bold text-gray-900 mb-4'>
                        {certificateData.eventName}
                    </h2>

                    {/*Event Date */}
                    <p className='text-center text-xs text-gray-600 mb-6'>
                        held on {certificateData.eventDate}
                    </p>

                    {/*Divide Line */}
                    <div className='border-t border-gray-300 mb-6'></div>

                    {/*Signature Section */}
                    <div className='flex items-center justify-between mb-4'>
                        <div className='text-xs text-gray-700'>
                            {certificateData.eventCoordinator}
                        </div>

                        <div className='w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center'>
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                        </div>

                        <div className='text-xs text-gray-700'>
                            {certificateData.president}
                        </div>
                    </div>

                    {/*Certificate ID */}
                    <p className='text-center text-xs text-gray-500'>
                        Certificate ID: {certificateData.certificateId}
                    </p>
                </div>
            </div>
        </div>

        {/* Download Section */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Generated Certificates</h3>
            {certificates.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading certificates...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No certificates found. They may still be generating.
            </div>
          ) : (
            <div className="space-y-4">
              {certificates.map((cert, index) => {
                const recipientData = recipients.find(r => r.id === cert.registration_id);

                return (
                  <div
                    key={cert.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {recipientData?.name || 'Unknown'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {recipientData?.email || ''}
                          </p>
                        </div>
                      </div>
                      <div className="ml-13 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Certificate #:</span>{' '}
                          {cert.certificate_number}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleDownload(cert.id, cert.certificate_number)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download PDF
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>



         {/* Certificate Information */}
<div className="bg-white rounded-3xl p-8 shadow-lg">
  <h3 className="text-lg font-semibold mb-4">Certificate Information</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div>
      <p className="text-gray-500">Event</p>
      <p className="font-medium">
        {formData.selectedEvent?.name || formData.selectedEvent?.title}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Certificate Type</p>
      <p className="font-medium capitalize">
        {formData.certificateType?.name}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Issued On</p>
      <p className="font-medium">
        {new Date().toLocaleDateString()}
      </p>
    </div>

    <div>
      <p className="text-gray-500">Total Recipients</p>
      <p className="font-medium">
        {formData.selectedRecipients.length}
      </p>
    </div>
  </div>
</div>

{/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Generate More Certificates
          </button>
        </div>
    </div>
   </div>
  );
}

export default CertificateView;