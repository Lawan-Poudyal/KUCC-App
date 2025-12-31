import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true)
    const [isAdmin,setIsAdmin]=useState(false)

    useEffect(()=>{
        const checkAdmin=async()=>{
            //1 .Get session to cheeck login
            const {data: sessionData}=await supabase.auth.getSession()

            if(!sessionData.session){
                setLoading(false)
                return
            }

            //2 .Check admin table to verify admin
            const {data:adminData,error}=await supabase
            .from('admins')
            .select('id, is_active')
            .eq('id', sessionData.session.user.id)
            .single()

            if(!error && adminData?.is_active){
                setIsAdmin(true)
            }else{
                // If not admin -> logout
                await supabase.auth.signOut()
            }
            setLoading(false)
        }
        checkAdmin()
    },[])

    if(loading){
        return  <p>Checking admin access...</p>
    }
    if(!isAdmin){
        return <Navigate to='/login' replace/>
    }
    return children
}

export default ProtectedRoute

{/*“Authentication verifies user identity,
 while authorization ensures role-based access using
  a protected route that validates admin privileges 
  from the database.” */}
