import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const STATUS={
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected", 
};

const MOCK_DATA=[
    {
        id:"mem_001",
        fullName:"Ayush Paudel",
        member_Code:"KU-CE-2024-04",
        applied_at:"20 Dec,2025",
        payment_amount:500,
        payment_method: "Digital Wallet",
        status:STATUS.PENDING,
    },
    {
        id:"mem_002",
        fullName:"Sujan Thapa",
        member_Code:"KU-CE-2024-05",
        applied_at:"22 Dec,2025",
        payment_amount:500,
        payment_method: "Bank Wallet",
        status:STATUS.APPROVED,
    },
    {
        id:"mem_003",
        fullName:"Ramesh Karki",
        member_Code:"KU-CE-2024-06",
        applied_at:"25 Dec,2025",
        payment_amount:500,
        payment_method: "Digital Wallet",
        status:STATUS.REJECTED,
    },

];


async function fetchMembershipsByStatus(status){
    return MOCK_DATA.filter((m)=> m.status === status);
}
async function updateMembershipStatus(id,status){
return true;
}

const MembershipApproval = () => {
    const [activeStatus,setActiveStatus]=useState(STATUS.PENDING);
    const [memberships,setMemberships]=useState([]);
    const [loading,setLoading]=useState(false);

    
    async function loadMemberships() {
        setLoading(true);
        const data=await fetchMembershipsByStatus(activeStatus);
        setMemberships(data);
        setLoading(false);
    }
    
    /*fetch when tab changes*/
    useEffect(()=>{
        loadMemberships();
    },[activeStatus]);

async function handleStatusChange(id,newStatus) {
    await updateMembershipStatus(id,newStatus);
    loadMemberships();
}

    return(
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
                            activeStatus === status ? "bg-[#383F78] text-white"
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

                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-[#383F78] text-white flex items-center justify-center font-semibold">
                                                        {m.fullName[0]}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium">{m.fullName}</p>
                                                        <p className="text-sm text-gray-500">{m.member_Code}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-4">{m.applied_at}</td>
                                            <td className="p-4">NPR {m.payment_amount}</td>
                                            <td className="p-4">{m.payment_method}</td>
                                            <td className="p-4 capitalize">{m.status}</td>

                                            <td className="p-4">
                                                <div className="flex justify-center gap-3">
                                                    {activeStatus === STATUS.PENDING && (
                                                        <>
                                                        <button onClick={()=> 
                                                            handleStatusChange(m.id,STATUS.APPROVED)
                                                        } className="px-4 py-2 bg-[#383F78] text-white rounded-md">Approve</button>

                                                        <button onClick={()=>
                                                            handleStatusChange(
                                                                m.id,
                                                                STATUS.REJECTED
                                                            )
                                                        }
                                                        className="px-4 py-2 border border-red-500 text-red-500 rounded-md">Reject</button>
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
    );  
}
export default MembershipApproval;