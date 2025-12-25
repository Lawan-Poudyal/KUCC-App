import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabaseClient'

function Dashboard() {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default Dashboard
