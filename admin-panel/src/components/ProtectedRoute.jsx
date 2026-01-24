import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

function ProtectedRoute({ children, allowedRoles = [] }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
        try{
             // Get current Supabase session
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setAuthorized(false);
        setLoading(false);
        return;
      }

       const userId = data.session.user.id;

        // Fetch admin role from Supabase
        const { data: adminData, error } = await supabase
          .from('admins')
          .select('role, is_active')
          .eq('id', userId)
          .single();

           if (error || !adminData || !adminData.is_active) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

           // Check if admin role is allowed
      if (allowedRoles.length && !allowedRoles.includes(adminData.role)) {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
    }catch (err) {
        console.error('ProtectedRoute auth check failed:', err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedRoles]);

  if (loading) return <p className="text-center mt-10">Checking access...</p>;
  if (!authorized) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
