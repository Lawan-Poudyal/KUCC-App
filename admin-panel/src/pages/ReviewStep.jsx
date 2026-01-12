import React from 'react'

const allRecipients = [
  { id: 1, name: "Tilashmi Dahal", email: "tilashmi@ku.edu.np" },
  { id: 2, name: "Ayush Paudel", email: "ayush@ku.edu.np" },
  { id: 3, name: "Lawan Paudel", email: "lawan@ku.edu.np" },
  { id: 4, name: "Kretee Shakya", email: "kretee@ku.edu.np" },
];


const ReviewStep = ({onBack,onNext,formData}) => {
 
    // extract values from formData
    const eventName=formData.selectedEvent?.name || 'No Event Selected';
    const certificateType= formData.certificateType?.name || 'No Type Selected';
    const recipients= formData.selectedRecipients || [];
    
   
  return (
    <div className='min-h-screen bg-gray-100 p-8 flex items-center justify-center'>
        <div className='w-full max-w-2xl'>

            {/*Header */}
            <div className='bg-gray-300 rounded-t-3xl p-6 flex items-center gap-4'>
                <div className='w-14 h-14 bg-indigo-900 rounded-2xl flex items-center justify-center'>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
                </div>
                <div>
                    <h1 className='text-xl font-bold text-gray-900'>Generate Certificates</h1>
                    <p className='text-sm text-gray-700'>Follow the steps to create certificates</p>
                </div>
            </div>

            {/*Steps */}
            <div className='bg-gray-300 px-6 pb-6 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg'>1</div>
                    <span className='text-sm font-semibold text-gray-900'>Event</span>
                </div>
                <div className='flex-1 h-0.5 bg-gray-400 mx-2'></div>

                <div className='flex items-center gap-2'>
                    <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg'>2</div>
                    <span className='text-sm font-semibold text-gray-900'>Type</span>
                </div>
                <div className='flex-1 h-0.5 bg-gray-400 mx-2'></div>

                <div className='flex items-center gap-2'>
                    <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg'>3</div>
                    <span className='text-sm font-semibold text-gray-900'>Recipients</span>
                </div>
                <div className='flex-1 h-0.5 bg-gray-400 mx-2'></div>

                <div className='flex items-center gap-2'>
                    <div className='w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg'>4</div>
                    <span className='text-sm font-semibold text-gray-900'>Review</span>
                </div>
            </div>

            {/*Main Content */}
            <div className='bg-gray-200 rounded-b-3xl p-8'>
                <div className='mb-6'>
                    <h2 className='text-xl font-bold text-gray-900 mb-2'>Step 4 : Review & Generate</h2>
                    <p className='text-sm text-gray-700'>Review your selections before generations</p>
                </div>

                {/*Review Cards */}
                <div className='space-y-4 mb-6'>
                    {/*Event Card */}
                    <div className='bg-white rounded-3xl p-6 text-center'>
                        <p className='text-sm text-gray-600 mb-2'>Event</p>
                        <h3 className='text-lg font-bold text-gray-900'>{eventName}</h3>
                    </div>

                    {/*Certificate Type Card */}
                    <div className='bg-white rounded-3xl p-6 text-center'>
                        <p className='text-sm text-gray-600 mb-2'>Certificate Type</p>
                        <h3 className='text-lg font-bold text-gray-900'>{certificateType}</h3>
                    </div>

                    {/*Recipients Card */}
                    <div className='bg-white rounded-3xl p-6 text-center'>
                        <p className='text-sm text-gray-600 mb-2'>Recipients</p>
                        <h3 className='text-lg font-bold text-gray-900 mb-1'>
                            {recipients.length} Member{recipients.length !== 1 ? 's': ''}
                        </h3>
                        <p className='text-base font-bold text-gray-900'>
                            {recipients
                            .map((rid)=> allRecipients.find(r => r.id=== rid)?.name)
                            .filter(Boolean)
                            .join(', ')
                            }
                        </p>
                    </div>

                    {/*Success Message */}
                    <div className='bg-green-200 rounded-3xl p-6 flex items-center justify-center gap-3'>
                         <svg className="w-6 h-6 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className='text-sm text-green-700 font-medium text-center'>
                Certificates will be generated and sent via email automatically
              </p>
                    </div>
                </div>

                {/*Navigation Buttons */}
                <div className='flex items-center justify-between gap-4'>
                    <button 
                    onClick={onBack}
                    className='flex items-center gap-2 bg-white rounded-2xl px-8 py-4 font-bold text-gray-900 hover:shadow-md transition-shadow'>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK
                    </button>

                    <button
                    onClick={onNext}
                    className='flex items-center gap-2 bg-green-500 rounded-2xl px-8 py-4 font-bold text-gray-900 hover:bg-green-600 transition-colors'
                    >
                        Generate Certificate
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ReviewStep;