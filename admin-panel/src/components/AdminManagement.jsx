import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const  [currentUserId, setCurrentUserId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // Track which admin to delete


  const [newAdmin, setNewAdmin] = useState({
    email: "",
    full_name: "",
    password:"",
    role: "editor",
  });
  const [editingId, setEditingId] = useState(null);

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setCurrentUserId(data.session.user.id);
      }
    };
    getCurrentUser();
  }, []);

  // helper to get auth header
  const getAuthHeader = async () => {
    const { data, error } = await supabase.auth.getSession();

    const session = data?.session;

    if (error || !session) throw new Error("Not authenticated");

    return {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  };

  // fetch all admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = await getAuthHeader();

      const res = await fetch("http://localhost:5000/api/master/admins", {
        headers,
      });

      const data = await res.json();
      console.log("Fetched admins:", data);

      if (!res.ok) throw new Error(data.error || "Failed to fetch admins");

      setAdmins(data);
    } catch (err) {
      setError("Error fetching admins: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Add new admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password
    if (newAdmin.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const headers = await getAuthHeader();

      const res = await fetch("http://localhost:5000/api/master/admins", {
        method: "POST",
        headers,
        body: JSON.stringify(newAdmin),
      });

      const data = await res.json();
      console.log("Add admin response:", data);
      if (!res.ok) throw new Error(data.error || "Failed to add admin");
       alert("Admin added successfully! They can now login with their credentials.");

      setNewAdmin({
        email: "",
        full_name: "",
        password:"",  // reset password
        role: "editor",
      });
      fetchAdmins();
    } catch (err) {
      setError("Error adding admin: " + err.message);
    }
  };

  // Update admin role or active status
  const handleUpdateAdmin = async (admin) => {
    try {
      const headers = await getAuthHeader();

      const res = await fetch(
        `http://localhost:5000/api/master/admins/${admin.id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            role: admin.role,
            is_active: admin.is_active,
          }),
        },
      );

      const data = await res.json();
      console.log("Update admin response:", data);
      if (!res.ok) throw new Error(data.error || "Failed to update admin");

      setEditingId(null);
      fetchAdmins();
    } catch (err) {
      setError("Error updating admin: " + err.message);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async (adminId) => {
    try {
      const headers = await getAuthHeader();

      const res = await fetch(
        `http://localhost:5000/api/master/admins/${adminId}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await res.json();
      console.log("Delete admin response:", data);
      
      if (!res.ok) throw new Error(data.error || "Failed to delete admin");

      alert("Admin deleted successfully!");
      setDeleteConfirm(null);
      fetchAdmins();
    } catch (err) {
      setError("Error deleting admin: " + err.message);
      alert("Error deleting admin: " + err.message);
      setDeleteConfirm(null)
    }
  };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Master Admin Management
      </h2>

      {/*Add New Admin */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">
        <h3 className="font-semibold mb-4 text-gray-700">Add New Admin</h3>
        {error && <p className="text-red-400 mb-3">{error}</p>}

        <form
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          onSubmit={handleAddAdmin}
        >
          <input
            type="text"
            placeholder="Full Name"
            value={newAdmin.full_name}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, full_name: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newAdmin.email}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, email: e.target.value })
            }
            className="p-2 border rounded"
            required
          />
           <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={newAdmin.password}
            onChange={(e) =>
              setNewAdmin({ ...newAdmin, password: e.target.value })
            }
            className="p-2 border rounded"
            required
            minLength={6}
          />
          <select
            value={newAdmin.role}
            onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="editor">Editor</option>
            <option value="master">Master</option>
          </select>
          <button
            type="submit"
            className="bg-indigo-500 text-white rounded px-4 py-2 hover:bg-indigo-700 transition"
          >
            Add Admin
          </button>
        </form>
      </div>

      {/*Admins Table */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h3 className="font-semibold mb-4 text-gray-700">All Admins</h3>
        {loading ? (
          <p className="text-gray-500">Loading admins...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Full Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Role</th>
                  <th className="px-4 py-2 border">Active</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">
                      {admin.full_name}
                      {admin.id === currentUserId && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          You
                        </span>
                      )}
                      
                      </td>
                    <td className="px-4 py-2 border">{admin.email}</td>

                    <td className="px-4 py-2 border">
                      {editingId === admin.id ? (
                        <select
                          value={admin.role}
                          onChange={(e) =>
                            setAdmins((prev) =>
                              prev.map((a) =>
                                a.id === admin.id
                                  ? { ...a, role: e.target.value }
                                  : a,
                              ),
                            )
                          }
                          className="p-1 border rounded"
                        >
                          <option value="editor">Editor</option>
                          <option value="master">Master</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          admin.role === 'master' 
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {admin.role}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 border">
                      {editingId === admin.id ? (
                        <input
                          type="checkbox"
                          checked={admin.is_active}
                          onChange={(e) =>
                            setAdmins((prev) =>
                              prev.map((a) =>
                                a.id === admin.id
                                  ? { ...a, is_active: e.target.checked }
                                  : a,
                              ),
                            )
                          }
                        />
                      ) : admin.is_active ? (
                        <span className="text-green-600 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 border space-x-2">
                      {editingId === admin.id ? (
                        <>
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                            onClick={() => handleUpdateAdmin(admin)}
                          >
                            Save
                          </button>
                          <button
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition"
                            onClick={() => {setEditingId(null);
                              fetchAdmins();  // reset changes
                            }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>                        <button
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                          onClick={() => setEditingId(admin.id)}
                        >
                          Edit
                        </button>
                        {admin.id !== currentUserId && (
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                              onClick={() => setDeleteConfirm(admin.id)}
                            >
                              Delete
                            </button>

                      )}
                      </>
                    )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-orange-50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this admin? This
              action cannot be undone and will remove their account and all
              associated data.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => handleDeleteAdmin(deleteConfirm)}
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
