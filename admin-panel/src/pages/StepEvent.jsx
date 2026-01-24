import React from "react";

{/*const events = [
  { id:1,name: "HackFest 2025", date: "March 15, 2026", participants: 45 },
  { id:2, name: "Web Dev Workshop", date: "March 15, 2026", participants: 50 },
  { id:3, name: "AI/ML Bootcamp", date: "March 15, 2026", participants: 80 },
]; */}

const StepEvent = ({formData, setFormData,onNext,events=[],loading}) => {
  const selectEvent=(event)=>{
    setFormData({...formData, selectedEvent: event});
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-gray-300 rounded-t-3xl p-6 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-900 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <p className="text-sm text-gray-700">Follow the steps to create certifications</p>
          </div>
        </div>


        {/*using react fragment that decrease the code */}

        {/* Steps */}
        <div className="bg-gray-300 px-6 pb-6 flex items-center justify-between">
          {["Event", "Type", "Recipients", "Review"].map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    idx === 0 ? "bg-blue-600 text-white" : "bg-white text-gray-500"
                  }`}
                >
                  {idx + 1}
                </div>
                <span className={`text-sm font-semibold ${idx === 0 ? "text-gray-900" : "text-gray-600"}`}>{step}</span>
              </div>
              {idx < 3 && <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>}
            </React.Fragment>
          ))}
        </div>

        {/* 
        <div className="bg-gray-300 px-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
            <span className="text-sm font-semibold text-gray-900">Event</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">2</div>
            <span className="text-sm font-medium text-gray-600">Type</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">3</div>
            <span className="text-sm font-medium text-gray-600">Recipients</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-500 font-bold text-lg">4</div>
            <span className="text-sm font-medium text-gray-600">Review</span>
          </div>
        </div>
*/}
       {/*Main Content */}
        <div className="bg-gray-200 rounded-b-3xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Step-1: Select Event</h2>
            <p className="text-sm text-gray-700">
              Choose which events you want to generate certificates for
            </p>
          </div>

          {loading ? (
             <p className="text-gray-600 text-center mt-8">Loading events...</p>
          ):(
            // event list
             <div className="space-y-4 mb-8">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => selectEvent(event)}
                className={`bg-white rounded-2xl p-6 cursor-pointer  transition-all
                ${
                  formData.selectedEvent?.id === event.id
                    ? "ring-4 ring-blue-600"
                    : "hover:shadow-md"
                }
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title || event.name}</h3>
                    <p className="text-sm text-gray-600">Date: {event.event_date || event.date}</p>
                  </div>
                  <div className="bg-gray-200 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-700">{event.participants || event.registrations_count || 0} participants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )
        }

          {/* Navigation buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
            disabled
            className="flex items-center gap-2 bg-white rounded-2xl px-8 py-4 font-bold text-gray-900 hover:shadow-md transition-shadow">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK
            </button>

            <button 
            onClick={onNext}
            disabled={!formData.selectedEvent}
            className="flex items-center gap-2 bg-blue-600 rounded-2xl px-8 py-4 font-bold text-white hover:bg-blue-700 transition-colors">
              NEXT
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepEvent;
