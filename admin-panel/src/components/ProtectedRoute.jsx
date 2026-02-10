import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
        try{
             // Get current Supabase session
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setError('not_authenticated');
        setAuthorized(false);
        setLoading(false);
        return;
      }

       const userId = data.session.user.id;

        // Fetch admin role from Supabase
        const { data: adminData, error:adminError } = await supabase
          .from('admins')
          .select('role, is_active, full_name')
          .eq('id', userId)
          .single();

          if (adminError) {
          console.error('Admin fetch error:', adminError);
          setError('admin_not_found');
          await supabase.auth.signOut();
          setAuthorized(false);
          setLoading(false);
          return;
        }
        if (!adminData) {
          setError('admin_not_found');
          await supabase.auth.signOut();
          setAuthorized(false);
          setLoading(false);
          return;
        }
         if (!adminData.is_active) {
          setError('account_deactivated');
          await supabase.auth.signOut();
          setAuthorized(false);
          setLoading(false);
          return;
        }

          setUserRole(adminData.role);
           // Check if admin role is allowed
      if (allowedRoles.length && !allowedRoles.includes(adminData.role)) {
        setError('Insufficient_permissions');
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }catch (err) {
        console.error('ProtectedRoute auth check failed:', err);
        setError('auth_error');
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (error === 'not_authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Account deactivated - show error message
  if (error === 'account_deactivated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Account Deactivated
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Your account has been deactivated by an administrator. Please contact support for assistance.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin not found - show error message
  if (error === 'admin_not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Access Denied
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Admin account not found. Please contact support for assistance.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Insufficient permissions - show error with role info
  if (error === 'insufficient_permissions') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Insufficient Permissions
            </h2>
            <p className="text-gray-600 text-center mb-2">
              This page requires{' '}
              <span className="font-semibold text-indigo-600">
                {allowedRoles.join(' or ')}
              </span>{' '}
              role access.
            </p>
            <p className="text-gray-600 text-center mb-6">
              Your current role is{' '}
              <span className="font-semibold text-gray-800">{userRole}</span>.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
              >
                Go to Dashboard
              </button>
              <p className="text-sm text-gray-500 text-center">
                If you believe this is an error, please contact your administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // General auth error
  if (error === 'auth_error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">
              Authentication Error
            </h2>
            <p className="text-gray-600 text-center mb-6">
              An error occurred while verifying your credentials. Please try logging in again.
            </p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authorized for unknown reason
  if (!authorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // All checks passed - render the protected component

  

  return children;
}

export default ProtectedRoute;
