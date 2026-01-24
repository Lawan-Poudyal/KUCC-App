import { Eye, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getMembershipsByStatus, updateMembershipStatus } from "../services/memberService.js";
import { supabase } from "../services/supabaseClient";
import AdminLayout from "../layouts/AdminLayout";

const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected", 
};

const MembershipApproval = () => {
    const [activeStatus, setActiveStatus] = useState(STATUS.PENDING);
    const [memberships, setMemberships] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Fetch when tab changes
    useEffect(() => {
        const loadMemberships = async () => {
            try {
                setLoading(true);
                const data = await getMembershipsByStatus(activeStatus);
                setMemberships(data);
            } catch (error) {
                console.error("Failed to load memberships:", error.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadMemberships();
    }, [activeStatus]);

    // Reload memberships manually
    const reloadMemberships = async () => {
        try {
            setLoading(true);
            const data = await getMembershipsByStatus(activeStatus);
            setMemberships(data);
        } catch (error) {
            console.error("Failed to reload memberships:", error.message);
        } finally {
            setLoading(false);
        }
    };

    // Approve / reject
    const handleStatusChange = async (id, newStatus) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert("Admin not authorized");
                return;
            }
            await updateMembershipStatus(id, newStatus, user.id);
            reloadMemberships();
        } catch (error) {          
            alert("Failed to update status: " + error.message);
        } 
    };

    // View member details
    const handleViewMember = (member) => {
        setSelectedMember(member);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMember(null);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-100 p-10">
                <div className="bg-white rounded-xl shadow-md p-6">
                    {/* Title */}
                    <h1 className="text-2xl font-semibold text-[#383F78]">Membership Approval</h1>

                    {/* Tabs */}
                    <div className="flex gap-4 mt-6">
                        {Object.values(STATUS).map((status) => (
                            <button
                                key={status}
                                onClick={() => setActiveStatus(status)}
                                className={`px-6 py-2 rounded-md font-medium capitalize transition ${
                                    activeStatus === status 
                                    ? "bg-[#383F78] text-white"
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
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
                                    ) : (
                                        memberships.map((m) => (
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

                                                {/* Amount */}
                                                <td className="p-4">NPR {m.payment_amount}</td>

                                                {/* Method */}
                                                <td className="p-4 capitalize">{m.payment_method}</td>

                                                {/* Status */}
                                                <td className="p-4 capitalize">{m.status}</td>

                                                {/* Actions */}
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-3">
                                                        {activeStatus === STATUS.PENDING && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleStatusChange(m.id, STATUS.APPROVED)} 
                                                                    className="px-4 py-2 bg-[#383F78] text-white rounded-md hover:bg-[#2c3460] transition"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleStatusChange(m.id, STATUS.REJECTED)}
                                                                    className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                        <button 
                                                            onClick={() => handleViewMember(m)}
                                                            className="p-2 border rounded-md hover:bg-gray-100 transition"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
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

                {/* Modal */}
                {showModal && selectedMember && (
                    <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b">
                                <h2 className="text-2xl font-semibold text-[#383F78]">Member Details</h2>
                                <button 
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6">
                                {/* Profile Section */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                                    <div className="w-20 h-20 rounded-full bg-[#383F78] text-white flex items-center justify-center text-3xl font-semibold">
                                        {selectedMember.full_name?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{selectedMember.full_name}</h3>
                                        <p className="text-gray-500">{selectedMember.member_code || "No Member Code"}</p>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Status</p>
                                        <p className={`font-semibold capitalize ${
                                            selectedMember.status === 'approved' ? 'text-green-600' :
                                            selectedMember.status === 'rejected' ? 'text-red-600' :
                                            'text-yellow-600'
                                        }`}>
                                            {selectedMember.status}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Payment Amount</p>
                                        <p className="font-semibold text-gray-800">NPR {selectedMember.payment_amount}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                        <p className="font-semibold text-gray-800 capitalize">{selectedMember.payment_method}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Applied Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {new Date(selectedMember.applied_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {selectedMember.reviewed_at && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Reviewed Date</p>
                                            <p className="font-semibold text-gray-800">
                                                {new Date(selectedMember.reviewed_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}

                                    {selectedMember.member_code && (
                                        <div>
                                            <p className="text-sm text-gray-500 mb-1">Member Code</p>
                                            <p className="font-semibold text-gray-800">{selectedMember.member_code}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons in Modal */}
                                {activeStatus === STATUS.PENDING && (
                                    <div className="flex gap-3 mt-6 pt-6 border-t">
                                        <button 
                                            onClick={() => {
                                                handleStatusChange(selectedMember.id, STATUS.APPROVED);
                                                closeModal();
                                            }}
                                            className="flex-1 px-6 py-3 bg-[#383F78] text-white rounded-md hover:bg-[#2c3460] transition font-medium"
                                        >
                                            Approve Member
                                        </button>
                                        <button 
                                            onClick={() => {
                                                handleStatusChange(selectedMember.id, STATUS.REJECTED);
                                                closeModal();
                                            }}
                                            className="flex-1 px-6 py-3 border-2 border-red-500 text-red-500 rounded-md hover:bg-red-50 transition font-medium"
                                        >
                                            Reject Member
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );  
}

export default MembershipApproval;