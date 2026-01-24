import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { supabase } from '../services/supabaseClient';

const SuccessToast = ({ message, onClose }) => {
    return (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 hover:text-gray-200 text-xl">×</button>
        </div>
    );
};

const CreateEvent = () => {
  const { id } = useParams(); // if id exists → edit mode
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [bannerPreview, setBannerPreview] = useState(null);

    // The main object holding all form values (name, date, fee, etc.) is formData
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        registrationFee: '',
        eventType: '',
        accessLevel: 'kucc-only',
        banner: null,
        isPaid: false,
        paymentAmount: '0',
        paymentMethods:['Cash','Online']
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const eventTypes = [
        'Workshop',
        'Competition',
        'Tournament',
        'Seminar',
        'Hackathon',
        'Annual Event',
        'Tech Talk',
        'Other'
    ];

    const availablePaymentMethods = [
        'Cash',
        'Online',
        'Bank Transfer',
        'eSewa',
        'Khalti',
        'Credit/Debit Card'
    ];


    const validateField = (name, value) => {
        switch (name) {
            case 'eventName':
                return value.trim().length < 3 ? 'Event name must be at least 3 characters' : '';
            case 'description':
                return value.trim().length < 10 ? 'Description must be at least 10 characters' : '';
            case 'date':
                return !value ? 'Date is required' : '';
            case 'time':
                return !value ? 'Time is required' : '';
            case 'location':
                return value.trim().length < 3 ? 'Location must be at least 3 characters' : '';
            case 'maxParticipants':
                return !value || value < 1 ? 'Must be at least 1' : '';
            case 'registrationFee':
                return value === '' || value < 0 ? 'Fee must be 0 or greater' : '';
            case 'eventType':
                return !value ? 'Please select an event type' : '';
                case 'paymentAmount':
                if (formData.isPaid && (!value || parseFloat(value) <= 0)) {
                    return 'Payment amount must be greater than 0 for paid events';
                }
                return '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
       
        if (name === 'isPaid') {
            setFormData(prev => ({ 
                ...prev, 
                isPaid: checked,
                paymentAmount: checked ? prev.registrationFee || '0' : '0'
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }

        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handlePaymentMethodToggle = (method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.includes(method)
                ? prev.paymentMethods.filter(m => m !== method)
                : [...prev.paymentMethods, method]
        }));
    };



    const handleBannerUpload = (e) => {
        const file = e.target.files[0];
        if(!file) return;

        
            if (file.size > 5 * 1024 * 1024) { //5MB
                setErrors(prev => ({ ...prev, banner: 'File size must be less than 5MB' }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);  // preview new banner
                setFormData(prev => ({ ...prev, banner: file })); // mark new banner for upload
                setErrors(prev => ({ ...prev, banner: '' }));
            };
            reader.readAsDataURL(file);
        };
  

    // this handles three major tasks: Validation,File Storage and database insertion
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'banner' && key !== 'accessLevel') {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });

         // Validate payment methods if event is paid
        if (formData.isPaid && formData.paymentMethods.length === 0) {
            newErrors.paymentMethods = 'Please select at least one payment method';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
            return;
        }

      try{
        // Upload banner image
        let bannerUrl= null;

       
// Upload new banner only if selected
        if(formData.banner){
            const bannerFile=formData.banner;
            console.log(bannerFile);
            const fileName= `${Date.now()}_${bannerFile.name}`;
            console.log(fileName);

            const {error: uploadError}= await supabase.storage
            .from('event-banners')
            .upload(fileName,bannerFile);

            if(uploadError) throw uploadError;

            const {data}=supabase.storage
            .from('event-banners')
            .getPublicUrl(fileName);

            bannerUrl= data.publicUrl;
            console.log(bannerUrl);
        }else if(bannerPreview){
              // Keep existing banner URL if no new file selected
            bannerUrl=bannerPreview;
        }

         const eventData = {
                title: formData.eventName,
                description: formData.description,
                event_date: formData.date,
                event_time: formData.time,
                location: formData.location,
                max_participants: Number(formData.maxParticipants),
                registration_fee: Number(formData.registrationFee),
                event_type: formData.eventType,
                access_level: formData.accessLevel,
                banner_url: bannerUrl || bannerPreview,
                // NEW PAYMENT FIELDS
                is_paid: formData.isPaid,
                payment_amount: formData.isPaid ? Number(formData.paymentAmount) : 0,
                payment_methods: formData.isPaid ? formData.paymentMethods : []
            };



        if(id){
            // update existing event
            const {error: updateError}=await supabase
            .from('events')
            .update(eventData)
            .eq('id',id);

            if(updateError) throw updateError;

            setSuccessMessage('Event updated successfully!');
            setShowSuccess(true);
            setTimeout(()=>{
                setShowSuccess(false);
                navigate('/event-management');
            },2000);

        }else{
            // create new event into database 
            const {error:insertError}= await supabase
            .from('events')
            .insert(eventData);
    
            if(insertError) throw insertError;
    
            setSuccessMessage('Event created successfully');
            setShowSuccess(true);

            // reset form for new event
            setFormData({
                eventName:'',
                description:'',
                date:'',
                time:'',
                location:'',
                maxParticipants:'',
                registrationFee:'',
                eventType:'',
                accessLevel:'kucc-only',
                banner: null,
                isPaid: false,
                paymentAmount: '0',
                paymentMethods: ['Cash', 'Online']

            });
            setBannerPreview(null);
         
        }
        setErrors({});
        setTouched({});
    }catch(err){
        console.error('Error:',err);
        alert('Failed to save event:'+err.message);
    }
};

 const handleSaveDraft = () => {
        // Save draft to localStorage
        localStorage.setItem('eventDraft', JSON.stringify(formData));
        setSuccessMessage('Event saved as draft!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

// fetch event data for editing
useEffect(()=>{
if (!id) return;

const fetchEvent=async () => {
    const {data,error}=await supabase
    .from('events')
    .select('*')
    .eq('id',id)
    .single();

    if(error){
        alert('Failed to fetch event:' +error.message);
        return;
    }

    setFormData({
        eventName: data.title,
        description: data.description,
        date: data.event_date,
        time: data.event_time,
        location: data.location,
        maxParticipants: data.max_participants,
        registrationFee: data.registration_fee,
        eventType: data.event_type,
        accessLevel: data.access_level,
        banner: null,
        isPaid: data.is_paid || false,
        paymentAmount: data.payment_amount || '0',
        paymentMethods: data.payment_methods || ['Cash', 'Online']

    });
    setBannerPreview(data.banner_url || null);
};
fetchEvent();
},[id]);
        
   return (
        <AdminLayout>
            {showSuccess && (
                <SuccessToast
                    message={successMessage}
                    onClose={() => setShowSuccess(false)}
                />
            )}

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/event-management')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold" style={{ color: '#585F8A' }}>
                        {id ? 'Edit Event' : 'Create New Event'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
                    {/* Event Details Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#585F8A' }}>Event Details</h3>

                        {/* Banner Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Event Banner</label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                                onClick={() => document.getElementById('banner-upload').click()}
                            >
                                {bannerPreview ? (
                                    <div className="relative inline-block">
                                        <img src={bannerPreview} alt="Preview" className="max-h-48 rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setBannerPreview(null);
                                                setFormData(prev => ({ ...prev, banner: null }));
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#585F8A20' }}>
                                            <svg className="w-8 h-8" style={{ color: '#585F8A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm font-medium">Upload Event Banner (1800x800)</p>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="banner-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleBannerUpload}
                                className="hidden"
                            />
                            {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner}</p>}
                        </div>

                        {/* Event Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Event Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.eventName && touched.eventName
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                }`}
                                placeholder="Enter event name"
                            />
                            {errors.eventName && touched.eventName && (
                                <p className="text-red-500 text-xs mt-1">{errors.eventName}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                                    errors.description && touched.description
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                }`}
                                placeholder="Enter event description"
                            />
                            {errors.description && touched.description && (
                                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                            )}
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.date && touched.date
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                />
                                {errors.date && touched.date && (
                                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                        errors.time && touched.time
                                            ? 'border-red-500 focus:ring-red-200'
                                            : 'border-gray-300 focus:ring-blue-200'
                                    }`}
                                />
                                {errors.time && touched.time && (
                                    <p className="text-red-500 text-xs mt-1">{errors.time}</p>
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.location && touched.location
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                }`}
                                placeholder="Enter event location"
                            />
                            {errors.location && touched.location && (
                                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                            )}
                        </div>

                        {/* Max Participants */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Max Participants <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="maxParticipants"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="1"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.maxParticipants && touched.maxParticipants
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                }`}
                                placeholder="Enter maximum participants"
                            />
                            {errors.maxParticipants && touched.maxParticipants && (
                                <p className="text-red-500 text-xs mt-1">{errors.maxParticipants}</p>
                            )}
                        </div>

                        {/* Registration Fee */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Registration Fee (NPR) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="registrationFee"
                                value={formData.registrationFee}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="0"
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.registrationFee && touched.registrationFee
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                }`}
                                placeholder="Enter registration fee"
                            />
                            {errors.registrationFee && touched.registrationFee && (
                                <p className="text-red-500 text-xs mt-1">{errors.registrationFee}</p>
                            )}
                        </div>

                        {/* Event Type */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Event Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="eventType"
                                value={formData.eventType}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                    errors.eventType && touched.eventType
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-blue-200'
                                }`}
                            >
                                <option value="">Select event type</option>
                                {eventTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.eventType && touched.eventType && (
                                <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
                            )}
                        </div>

                        {/* Access Level */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                                Access Level <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                <label
                                    className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                                    style={{
                                        borderColor: formData.accessLevel === 'kucc-only' ? '#585F8A' : '#e5e7eb',
                                        backgroundColor: formData.accessLevel === 'kucc-only' ? '#585F8A10' : 'white'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="accessLevel"
                                        value="kucc-only"
                                        checked={formData.accessLevel === 'kucc-only'}
                                        onChange={handleChange}
                                        className="mt-1"
                                        style={{ accentColor: '#585F8A' }}
                                    />
                                    <div>
                                        <p className="font-medium" style={{ color: '#585F8A' }}>KUCC Member Only</p>
                                        <p className="text-sm text-gray-500">Only verified members can register</p>
                                    </div>
                                </label>

                                <label
                                    className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                                    style={{
                                        borderColor: formData.accessLevel === 'ku-students' ? '#585F8A' : '#e5e7eb',
                                        backgroundColor: formData.accessLevel === 'ku-students' ? '#585F8A10' : 'white'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="accessLevel"
                                        value="ku-students"
                                        checked={formData.accessLevel === 'ku-students'}
                                        onChange={handleChange}
                                        className="mt-1"
                                        style={{ accentColor: '#585F8A' }}
                                    />
                                    <div>
                                        <p className="font-medium" style={{ color: '#585F8A' }}>All KU Students</p>
                                        <p className="text-sm text-gray-500">All KU students can register</p>
                                    </div>
                                </label>

                                <label
                                    className="flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                                    style={{
                                        borderColor: formData.accessLevel === 'any-students' ? '#585F8A' : '#e5e7eb',
                                        backgroundColor: formData.accessLevel === 'any-students' ? '#585F8A10' : 'white'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="accessLevel"
                                        value="any-students"
                                        checked={formData.accessLevel === 'any-students'}
                                        onChange={handleChange}
                                        className="mt-1"
                                        style={{ accentColor: '#585F8A' }}
                                    />
                                    <div>
                                        <p className="font-medium" style={{ color: '#585F8A' }}>Open For All</p>
                                        <p className="text-sm text-gray-500">All students of any universities can register</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* NEW PAYMENT SECTION */}
                    <div className="mb-6 border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#585F8A' }}>Payment Settings</h3>

                        {/* Is Paid Event Toggle */}
                        <div className="mb-4">
                            <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all"
                                style={{
                                    borderColor: formData.isPaid ? '#585F8A' : '#e5e7eb',
                                    backgroundColor: formData.isPaid ? '#585F8A10' : 'white'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    name="isPaid"
                                    checked={formData.isPaid}
                                    onChange={handleChange}
                                    className="w-5 h-5"
                                    style={{ accentColor: '#585F8A' }}
                                />
                                <div>
                                    <p className="font-medium" style={{ color: '#585F8A' }}>This is a Paid Event</p>
                                    <p className="text-sm text-gray-500">Participants need to pay to register</p>
                                </div>
                            </label>
                        </div>

                        {/* Payment Amount (only if isPaid is true) */}
                        {formData.isPaid && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Payment Amount (NPR) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="paymentAmount"
                                        value={formData.paymentAmount}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        min="0"
                                        step="0.01"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                                            errors.paymentAmount && touched.paymentAmount
                                                ? 'border-red-500 focus:ring-red-200'
                                                : 'border-gray-300 focus:ring-blue-200'
                                        }`}
                                        placeholder="Enter payment amount"
                                    />
                                    {errors.paymentAmount && touched.paymentAmount && (
                                        <p className="text-red-500 text-xs mt-1">{errors.paymentAmount}</p>
                                    )}
                                </div>

                                {/* Payment Methods */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">
                                        Accepted Payment Methods <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {availablePaymentMethods.map(method => (
                                            <label
                                                key={method}
                                                className="flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all"
                                                style={{
                                                    borderColor: formData.paymentMethods.includes(method) ? '#585F8A' : '#e5e7eb',
                                                    backgroundColor: formData.paymentMethods.includes(method) ? '#585F8A10' : 'white'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.paymentMethods.includes(method)}
                                                    onChange={() => handlePaymentMethodToggle(method)}
                                                    className="w-4 h-4"
                                                    style={{ accentColor: '#585F8A' }}
                                                />
                                                <span className="text-sm font-medium">{method}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.paymentMethods && (
                                        <p className="text-red-500 text-xs mt-1">{errors.paymentMethods}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-4 pt-6">
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all"
                            style={{ backgroundColor: '#585F8A' }}
                        >
                            {id ? 'Update Event' : 'Create Event'}
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="flex-1 py-3 border-2 rounded-xl font-medium hover:bg-gray-50 transition-all"
                            style={{ borderColor: '#585F8A', color: '#585F8A' }}
                        >
                            Save as Draft
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>
        </AdminLayout>
    );
};

export default CreateEvent;
