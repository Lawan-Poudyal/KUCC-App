import React, { useState } from 'react'
import StepEvent from './StepEvent';
import TypeCertificate from './TypeCertificate';
import RecipientSelection from './RecipientSelection';
import ReviewStep from './ReviewStep';
import CertificateView from './CertificateView';

const CertificateGenerator = () => {

const [currentStep, setCurrentStep]= useState(1);
const [formData, setFormData]= useState({
    selectedEvent: null,
    certificateType: null,
    selectedRecipients:[]
});

const next=()=> setCurrentStep((s)=> s+1);
const back=()=> setCurrentStep((s)=> s-1);

return(
    <div className='max-w-3xl mx-auto p-6'>
        {currentStep === 1 && (
            <StepEvent formData={formData} setFormData={setFormData} onNext={next}/>
        )}

        {currentStep === 2 && (
            <TypeCertificate 
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            />
        )}

        {currentStep === 3 && (
            <RecipientSelection
            formData={formData}
            setFormData={setFormData}
            onNext={next}
            onBack={back}
            />
        )}

        {currentStep === 4 && (
            <ReviewStep
            formData={formData}
            onNext={next}
            onBack={back}
            />
        )}

        {currentStep === 5 &&
        <CertificateView formData={formData}/>
        }
    </div>
);
};

export default CertificateGenerator;