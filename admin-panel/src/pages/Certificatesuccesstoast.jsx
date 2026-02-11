import React, { useEffect } from 'react';

const CertificateSuccessToast = ({ 
  isOpen, 
  onClose, 
  successCount
}) => {
  // Auto close after 10 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-md border-l-4 border-green-500">
        <div className="p-4">
          <div className="flex items-start">
            {/* Success Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                ✅ Certificates Sent Successfully!
              </h3>
              <p className="text-sm text-gray-600">
                {successCount} certificate{successCount > 1 ? 's have' : ' has'} been sent to recipient email{successCount > 1 ? 's' : ''}. 
                They can download from their email.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateSuccessToast;