import React from 'react'


const allRecipients = [
  { id: 1, name: "Tilashmi Dahal", email: "tilashmi@ku.edu.np" },
  { id: 2, name: "Ayush Paudel", email: "ayush@ku.edu.np" },
  { id: 3, name: "Lawan Paudel", email: "lawan@ku.edu.np" },
  { id: 4, name: "Kretee Shakya", email: "kretee@ku.edu.np" },
];



// reusable button component
const CertificateButton=({onClick,icon,label})=>(
    <button
    onClick={onClick}
    className='flex items-center justify-center gap-2 border-2 border-gray-300 rounded-xl px-6 py-3 hover:bg-gray-50 transition-colors'
    >{icon}
    <span className='text-sm font-medium text-gray-700'>{label}</span>
    </button>
);

const CertificateView = ({formData}) => {

    const firstRecipientId = formData.selectedRecipients[0];
    const recipient = allRecipients.find(r => r.id === firstRecipientId);
    
    // use formData from props
    const certificateData={
        organization :'KATHMANDU UNIVERSITY COMPUTER CLUB',
        certificateType: formData.certificateType?.name || 'CERTIFICATE OF PARTICIPATION',
       recipientName: recipient?.name || 'Recipient Name',
        eventName: formData.selectedEvent?.name || 'Event Name',
        eventDate: formData.selectedEvent?.date || 'Event Date',
        eventCoordinator:'Event Coordinator',
        president: 'KUCC President',
        certificateId: 'CERT-2025-GIT-03'
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

         {/* Certificate Information */}
<div className="bg-white rounded-3xl p-8 shadow-lg">
  <h3 className="text-lg font-semibold mb-4">Certificate Information</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    <div>
      <p className="text-gray-500">Event</p>
      <p className="font-medium">
        {formData.selectedEvent?.name}
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


      
    </div>
   </div>
  );
}

export default CertificateView;