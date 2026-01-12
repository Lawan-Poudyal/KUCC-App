import React from "react";

const certificateTypes = [
  {
    id: "participation",
    name: "Participation",
    description: "For events attenders",
    icon: (
      <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9ZM17 15.99L12 18.72L7 15.99V12.27L12 15L17 12.27V15.99Z" />
      </svg>
    ),
  },
  {
    id: "achievement",
    name: "Achievement",
    description: "For winners/ achievers",
    icon: (
      <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 7H16V5L14 3H10L8 5V7H4C2.9 7 2 7.9 2 9V14C2 14.75 2.4 15.38 3 15.73V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V15.72C21.59 15.37 22 14.73 22 14V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5ZM4 9H20V14H15V11H9V14H4V9ZM13 15H11V13H13V15ZM19 19H5V16H9V17H15V16H19V19Z" />
        <path d="M17 14L19 16L23 12L21.59 10.58L19 13.17L17.59 11.76L17 14Z" />
      </svg>
    ),
    color: 'text-amber-500'
  },
  {
    id: "speaker",
    name: "Speaker",
    description: "For events speaker",
    icon: (
      <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" />
        <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" />
      </svg>
    ),
  },
  {
    id: "organizer",
    name: "Organizer",
    description: "For events organizer",
    icon: (
      <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" />
      </svg>
    ),
    color: "text-blue-500",
  },
];


const TypeCertificate = ({formData, setFormData, onNext,onBack}) => {
  
  const selectType=(type)=>{
    setFormData({...formData, certificateType: type});
  };

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
            <h1 className="text-xl font-bold text-gray-900">Generate Certificate</h1>
            <p className="text-sm text-gray-700">Follow the steps to create certificates</p>
          </div>
        </div>

        {/*Steps */}
        <div className="bg-gray-300 px-6 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
            <span className="text-sm font-semibold text-gray-900">Event</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>

          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
            <span className="text-sm font-semibold text-gray-900">Type</span>
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

        {/*Main Content */}
        <div className="bg-gray-200 rounded-b-3xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Step 2 : Choose Certificate Type</h2>
            <p className="text-sm text-gray-700">
              Select the type of certificates you want to create
            </p>
          </div>

          {/*Certificate Type Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {certificateTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => selectType(type)}
                className={`bg-white rounded-3xl p-8 cursor-pointer transition-all flex flex-col items-center text-center
              ${
                formData.certificateType?.id === type.id
                  ? "ring-4 ring-blue-600"
                  : "hover:shadow-md"
              }
              `}
              >
                <div className={`mb-4 ${type.color || "text-gray-900"}`}>
                  {type.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>

          {/*Navigation Buttons */}
          <div className="flex items-center justify-between gap-4">
            <button
            onClick={onBack}
            className="flex items-center gap-2 bg-white rounded-2xl px-8 py-4 font-bold text-gray-900 hover:shadow-md transition-shadow">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              BACK
            </button>

            <button
            onClick={onNext}
            disabled={!formData.certificateType}
            className="flex items-center gap-2 bg-blue-600 rounded-2xl px-8 py-4 font-bold text-white hover:bg-blue-700 transition-colors">
              NEXT
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeCertificate;
