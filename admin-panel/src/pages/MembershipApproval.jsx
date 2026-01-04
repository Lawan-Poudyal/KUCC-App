import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { getMembershipsByStatus, updateMembershipStatus } from "../services/memberService.js";
import { supabase } from "../services/supabaseClient";
import AdminLayout from "../layouts/AdminLayout"

const STATUS={
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected", 
};

const MembershipApproval = () => {
    const [activeStatus,setActiveStatus]=useState(STATUS.PENDING);
    const [memberships,setMemberships]=useState([]);
    const [loading,setLoading]=useState(false);

    
   // load memberships by status
   const loadMemberships=async () => {
    try {
        setLoading(true);
        const data=await getMembershipsByStatus(activeStatus);
        setMemberships(data);
    } catch (error) {
        console.error("Failed to load memberships:",error.message);
        
    }finally{
        setLoading(false);
    }
   };
    
    {/*fetch when tab changes*/}
    useEffect(()=>{
        loadMemberships();
    },[activeStatus]);

// approve / reject
const handleStatusChange=async (id,newStatus) => {
    try {
        const {data: {user},}=await supabase.auth.getUser();

        if(!user){
            alert("Admin not authorized");
            return;
        }
        await updateMembershipStatus(id,newStatus,user.id);
        loadMemberships();
        } catch (error) {          
        alert("Failed to update status:",error.message);
    } 
};

    return(
       
        <AdminLayout>
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="bg-white rounded-xl shadow-md p-6">
                {/*Title*/}
                <h1 className="text-2xl font-semibold text-[#383F78]">Membership Approval</h1>

                {/* Tabs*/}
                <div className="flex gap-4 mt-6" >
                    {Object.values(STATUS).map((status)=>(
                        <button
                        key={status}
                        onClick={()=> setActiveStatus(status)}
                        className={`px-6 py-2 rounded-md font-medium capitalize transition ${
                            activeStatus === status 
                            ? "bg-[#383F78] text-white"
: "bg-gray-200 text-gray-600 hover:bg-gray-300" }`}>
    {status}
</button>
             ))}
                </div>

                {/*Content*/}
                <div className="mt-8 overflow-x-auto">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : (
                        <table className="w-full">

                            <thead className="bg-gray-50 text-sm text-gray-600">
                                <tr>
                                    <th className="p-4 text-left">Member</th>
                                    <th className="p-4 text-left">Applied</th>
                                    <th className="p-4 text-left">Amount</th>
                                    <th className="p-4 text-left">Method</th>
                                    <th className="p-4 text-left">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {memberships.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-6 text-center text-gray-500">
                                            No records found
                                        </td>
                                    </tr>
                                ):(
                                    memberships.map((m)=>(
                                        <tr key={m.id} className="border-t hover:bg-gray-50">

                                             {/* Member */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#383F78] text-white flex items-center justify-center font-semibold">
                                                        {m.full_name?.[0]}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium">{m.full_name}</p>
                                                        <p className="text-sm text-gray-500">{m.member_code || "-"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                              {/* Applied */}
                                            <td className="p-4">
                                                {new Date(m.applied_at).toLocaleDateString()}
                                                </td>

                                                {/*Amount */}
                                            <td className="p-4">
                                                NPR {m.payment_amount}
                                                </td>

                                                {/* Method */}
                                            <td className="p-4">{m.payment_method}</td>

                                            {/* Status */}
                                            <td className="p-4 capitalize">{m.status}</td>


                                              
                                                {/* Actions */}
                                            <td className="p-4">
                                                <div className="flex justify-center gap-3">
                                                    {activeStatus === STATUS.PENDING && (
                                                        <>
                                                        <button onClick={()=> 
                                                            handleStatusChange(m.id,STATUS.APPROVED)
                                                        } 
                                                        className="px-4 py-2 bg-[#383F78] text-white rounded-md">
                                                            Approve
                                                            </button>

                                                        <button onClick={()=>
                                                            handleStatusChange(
                                                                m.id,
                                                                STATUS.REJECTED
                                                            )
                                                        }
                                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md">
                                                            Reject
                                                            </button>
                                                        </>
                                                    )}


                                                    <button className="p-2 border rounded-md">
                                                        <Eye size={18}/>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>               
            </div>
        </div>

        </AdminLayout>
    );  
}
export default MembershipApproval;