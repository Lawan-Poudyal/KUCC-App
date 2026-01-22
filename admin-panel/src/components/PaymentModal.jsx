import React from 'react'
import { useState } from 'react'

const PaymentModal = ({application,onClose,onUpdate}) => {
    const [paymentData, setPaymentData]=useState({
        payment_status: application.payment_status || 'unpaid',
        payment_method: application.payment_method || '',
        payment_amount: application.payment_amount || application.event_payment_amount || 0,
        transaction_id: application.transaction_id || ''
    });

    const handleSubmit=(e)=>{
      e.preventDefault();
      onUpdate(application.id, paymentData);
    };

    const paymentMethods=application.event_payment_methods || ['Cash','Online','Bank Transfer'];

  return (
   <div className='fixed inset-0 bg-yellow-100 bg-opacity-50 flex items-center justify-center z-50'>
    <div className='bg-white rounded-xl shadow-xl max-w-md w-full mx-4'>

      {/*Header */}
      <div className='border-b px-6 py-4'>
        <h3 className='text-lg font-semibold text-gray-900'>Update Payment Details</h3>
        <p className='text-sm text-gray-500 mt-1'>{application.event_title}</p>
      </div>

      {/*Form */}
      <form onSubmit={handleSubmit} className='p-6 space-y-4'>

        {/*Payment Status */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Payment Status
          </label>
          <select 
          value={paymentData.payment_status}
          onChange={(e)=> setPaymentData({...paymentData, payment_status: e.target.value})}
          className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#585F8A] focus:border-transparent'
          required
          >
            <option value="unpaid">Unpaid</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/*Payment Method */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Payment Method
          </label>

          <select
          value={paymentData.payment_method}
          onChange={(e)=>setPaymentData({...paymentData, payment_method:e.target.value})}
          className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#585F8A] focus:border-transparent'
          >
            <option value="">Select method</option>
            {paymentMethods.map((method)=>(
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/*Payment Amount */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Payment Amount (NPR)
          </label>
          <input
          type='number'
          step='0.01'
          value={paymentData.payment_amount}
          onChange={(e)=> setPaymentData({...paymentData, payment_amount:e.target.value})}
          className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#585F8A] focus:border-transparent'
          required
          />
        </div>

        {/*Transaction ID */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Transaction ID (Optional)
          </label>
          <input
          type='text'
          value={paymentData.transaction_id}
          onChange={(e)=> setPaymentData({...paymentData,transaction_id:e.target.value})}
          className='w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#585F8A] focus:border-transparent'
          placeholder='Enter transaction reference'
          />
        </div>

        {/*User Info */}
        <div className='bg-gray-50 rounded-lg p-3 text-sm'>
          <p className='text-gray-600'>
            <span className='font-medium'>User ID:</span>{application.user_id}
          </p>
          <p className='text-gray-600 mt-1'>
            <span className='font-medium'>Applied:</span>{' '}
            {new Date(application.applied_at).toLocaleString()}
          </p>
          {application.paid_at && (
            <p className='text-gray-600 mt-1'>
              <span className='font-medium'>Paid:</span>{' '}
              {new Date(application.paid_at).toLocaleString()}
            </p>
          )}
        </div>

        {/*Buttons*/}
        <div className='flex gap-3 pt-4'>
          <button
           type='button' 
           onClick={onClose} 
           className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'>
            Cancel
          </button>
          <button
          type='submit'
          className='flex-1 px-4 py-2 bg-[#585F8A] text-white rounded-lg hover:opacity-90'
          >
            Update Payment
          </button>
        </div>
      </form>
    </div>
   </div>
  );
};

export default PaymentModal;