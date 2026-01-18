import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';
import CreateEvent from './pages/CreateEvent';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import MembershipApproval from './pages/MembershipApproval';
import Notification from './pages/Notification'
import Events from './pages/Events';
import EventRegistrations from './pages/EventRegistrations';
import Members from './pages/Members';
import EventManagement from './pages/EventManagement';
import EventDetails from './pages/EventDetails';
import CertificateGenerator from './pages/CertificateGenerator';
import AdminManagement from './components/AdminManagement';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard → accessible to both editor and master */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['editor','master']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

  {/* Create & Edit Events → only editor */}
      <Route
        path="/create-event"
        element={
          <ProtectedRoute allowedRoles={['editor']}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-event/:id"
        element={
          <ProtectedRoute allowedRoles={['editor']}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      {/* View Events → both roles can see */} 
    
<Route 
path="/events"
element={
  <ProtectedRoute allowedRoles={['editor','master']}>
    <Events/>
  </ProtectedRoute>
}
/>

{/* Event Registrations → only editor */}

<Route
path="/event-registrations"
element={
  <ProtectedRoute allowedRoles={['editor']}>
    <EventRegistrations/>
  </ProtectedRoute>
}
/>

  {/* Members → only editor */}
<Route
path='/members'
element={
  <ProtectedRoute allowedRoles={['editor']}>
    <Members/>
  </ProtectedRoute>
}
/>

    {/* Membership Approval → only editor */}
      <Route 
      path='/membership'
      element={
        <ProtectedRoute allowedRoles={['editor']}>
          <MembershipApproval/>
        </ProtectedRoute>
      }
      />

  {/* Notifications → both roles */}
      <Route
      path='/sendnotification'
      element={
        <ProtectedRoute allowedRoles={['editor','master']}>
          <Notification/>
        </ProtectedRoute>
      }
      /> 

 {/* Event Management → both roles */}
      <Route
      path="/event-management"
      element={
        <ProtectedRoute allowedRoles={['editor','master']}>
          <EventManagement/>
        </ProtectedRoute>
      }
      />

      <Route
      path="/event-management/:eventId"
      element={
        <ProtectedRoute allowedRoles={['editor','master']}>
          <EventDetails/>
        </ProtectedRoute>
      }
      />

 {/* Certificate Generator → only editor */}
      <Route
      path="/certificate-generator"
      element={
       <ProtectedRoute allowedRoles={['editor']}>
       <CertificateGenerator/>
       </ProtectedRoute>

      }
      />

      <Route
      path='/admin-management'
      element={
        <ProtectedRoute allowedRoles={['master']}>
          <AdminManagement/>
        </ProtectedRoute>
      }
      />

     


    </Routes>
  );
}

export default App;

