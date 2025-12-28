import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import MembershipApproval from './pages/MembershipApproval'
import Notification from './pages/Notification'

function App() {
  return (
   
    <Routes>
      <Route path='/membership' element={<MembershipApproval/>}/>
      <Route path="/sendnotification" element={<Notification/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App;
