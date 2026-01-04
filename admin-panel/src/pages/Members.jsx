import React, { useEffect, useState } from 'react'
import { getMembershipsByStatus } from '../services/memberService.js';
import AdminLayout from '../layouts/AdminLayout';

const Members = () => {
    const [members,setMembers]=useState([]);
    const [loading,setLoading]= useState(true);

    useEffect(()=>{
        fetchMembers();
    },[]);

    const fetchMembers=async () => {
        try {
            const data=await getMembershipsByStatus("approved");
            setMembers(data);
        } catch (error) {
            console.error("Failed to fetch members:",error.message);
        }finally{
            setLoading(false);
        }
    };
  return (
    <AdminLayout>
        <h2 className='text-xl font-bold mb-4'>Members Directory</h2>

        <div className='bg-white rounded-xl shadow overflow-x-auto'>
            {loading ? (
                <p className='p-4'>Loading members...</p>
            ): members.length === 0 ? (
                <p className='p-4'>No approved members found</p>
            ):(
                <table className='w-full text-sm'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='px-4 py-3 text-left'>Name</th>
                            <th className='px-4 py-3 text-left'>Member Code</th>
                            <th className='px-4 py-3 text-left'>Payment</th>
                            <th className='px-4 py-3 text-left'>Method</th>
                            <th className='px-4 py-3 text-left'>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(m=>(
                            <tr key={m.id} className='border-t'>
                                <td className='px-4 py-3 font-medium'>
                                    {m.full_name}
                                </td>
                                <td className='px-4 py-3'>
                                    {m.member_code || "-"}
                                </td>
                                <td className='px-4 py-3'>
                                    Rs.{m.payment_amount}
                                </td>
                                <td className='px-4 py-3 capitalize'>
                                    {m.payment_method}
                                </td>
                                <td className='px-4 py-3'>
                                    {new Date(m.applied_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            
            )}
        </div>
    </AdminLayout>
  );
};

export default Members;