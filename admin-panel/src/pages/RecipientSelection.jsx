import React from "react";
const RecipientSelection = ({formData, setFormData,onNext,onBack,recipients = [] }) => {

 {/* const recipients = [
    { id: 1, name: "Tilashmi Dahal", email: "tilashmi@ku.edu.np" },
    { id: 2, name: "Ayush Paudel", email: "ayush@ku.edu.np" },
    { id: 3, name: "Lawan Paudel", email: "lawan@ku.edu.np" },
    { id: 4, name: "Kretee Shakya", email: "kretee@ku.edu.np" },
  ]; */}
 
const selectedRecipients= formData.selectedRecipients || [];

  const toggleRecipient = (id) => {
   setFormData((prev)=> ({
    ...prev,
    selectedRecipients: prev.selectedRecipients.includes(id)
    ? prev.selectedRecipients.filter((rid)=> rid !== id)
    : [...prev.selectedRecipients, id],
   }));
  };

  const selectAll = () => {
   setFormData((prev)=> ({
    ...prev,
    selectedRecipients: recipients.map((r)=> r.id),
   }));
  };

  const clearAll = () => {
    setFormData((prev)=> ({
      ...prev,
      selectedRecipients:[],
    }));
  };

  const selectedCount = selectedRecipients.length;
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/*Header */}
        <div className="bg-gray-300 rounded-t-3xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-900 rounded-2xl flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">Generate Certificates</h1>
            <p className="text-sm text-gray-700">Follow the steps to create certificates</p>
          </div>
        </div>

        {/*Steps */}
        <div className="bg-gray-300 px-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
            <span className="text-sm font-semibold text-gray-900">Events</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>

          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
            <span className="text-sm font-semibold text-gray-900">Type</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>

          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
            <span className="text-sm font-semibold text-gray-900">Recipients</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>

          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">4</div>
            <span className="text-sm font-medium text-gray-600">Review</span>
          </div>
        </div>

        {/*Main content */}
        <div className="bg-gray-200 rounded-b-3xl p-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Step 3 : Select Receipients</h2>
            <p className="text-sm text-gray-700 mb-4">Choose who will receive the certificates</p>

            {/*Select/Clear All Buttons */}
            <div className="flex gap-4 mb-6">
              <button onClick={selectAll} className="text-blue-600 text-sm font-medium hover:underline">
                Select All
              </button>

              <button onClick={clearAll} className="text-gray-700 text-sm font-medium hover:underline">
                Clear All
              </button>
            </div>
          </div>

          {/*Recipients List */}
          <div className="space-y-4 mb-6">

            {recipients.length === 0 ? (
               <p className="text-gray-600 text-center">No recipients found for this event.</p>
            ):(
            recipients.map((recipient) => {
              const isSelected= selectedRecipients.includes(recipient.id);
              return(
                <div
                key={recipient.id}
                onClick={()=> toggleRecipient(recipient.id)}
                className="bg-white rounded-2xl p-6 cursor-pointer hover:shadow-md flex items-center gap-4"
                >

                  {/*Checkbox */}
                  <div
                  className={`w-10 h-10 rounded-lg border-4 flex items-center justify-center
                    ${isSelected ? "bg-blue-600 border-blue-600":"bg-white border-gray-900"}
                    `}
                  >
                    {isSelected && (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/*Info */}
                  <div>
                  <h3 className="text-lg font-bold">{recipient.name}</h3>
                  <p className="text-sm text-gray-600">{recipient.email}</p>
                  </div>
                </div>
              );          
             })
            )}
          </div>

          {/* Selected Count */}
          <div className="bg-blue-300 rounded-2xl p-4 text-center mb-8">
            <span className="text-blue-700 font-medium">
                {selectedCount} recipient{selectedCount !==1 ? 's' : ''} selected
            </span>
          </div>

          {/*Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button 
            onClick={onBack}
            className="flex items-center gap-2 bg-white rounded-2xl px-8 py-4 font-bold text-gray-900 hover:shadow-md transition-shadow">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK
            </button>

            <button 
            onClick={onNext}
            disabled={selectedCount === 0}
            className="flex items-center gap-2 bg-blue-600 rounded-2xl px-8 py-4 font-bold text-white hover:bg-blue-700 transition-colors">
                NEXT
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg> 
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RecipientSelection;
