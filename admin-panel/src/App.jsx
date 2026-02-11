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
import EventDetails from './pages/EnhancedEventDetails';
import CertificateGenerator from './pages/CertificateGenerator';
import AdminManagement from './components/AdminManagement';

import  EventApplications from './pages/EventApplications';
import EnhancedEventDetails from './pages/EnhancedEventDetails';
import AdminLayout from './layouts/AdminLayout';

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
          <ProtectedRoute allowedRoles={['editor','master']}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-event/:id"
        element={
          <ProtectedRoute allowedRoles={['editor','master']}>
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
  <ProtectedRoute allowedRoles={['editor','master']}>
    <EventRegistrations/>
  </ProtectedRoute>
}
/>

  {/* Members → only editor */}
<Route
path='/members'
element={
  <ProtectedRoute allowedRoles={['editor','master']}>
    <Members/>
  </ProtectedRoute>
}
/>

    {/* Membership Approval → only editor */}
      <Route 
      path='/membership'
      element={
        <ProtectedRoute allowedRoles={['editor','master']}>
          <MembershipApproval/>
        </ProtectedRoute>
      }
      />

  {/* Notifications → both roles */}
      <Route
      path='/sendnotification'
      element={
        <ProtectedRoute allowedRoles={['editor','master']}>
          <AdminLayout>

          <Notification/>
          </AdminLayout>
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

       {/* Event Details → UPDATED to use EnhancedEventDetails with payment tab */}

      <Route
      path="/event-management/:eventId"
      element={
        <ProtectedRoute allowedRoles={['editor','master']}>
          <EnhancedEventDetails/>
        </ProtectedRoute>
      }
      />

       {/* NEW ROUTE - Event Applications & Payments → only editor */}
       <Route
       path='/event-applications'
       element={
        <ProtectedRoute allowedRoles={['editor','master']}>
          <EventApplications/>
        </ProtectedRoute>
       }
       />

 {/* Certificate Generator → only editor */}
      <Route
      path="/certificate-generator"
      element={
       <ProtectedRoute allowedRoles={['editor','master']}>
        <AdminLayout>

       <CertificateGenerator/>
        </AdminLayout>
       </ProtectedRoute>

      }
      />

 {/* Admin Management → only master */}
      <Route
      path='/admin-management'
      element={
        <ProtectedRoute allowedRoles={['master']}>
          <AdminLayout>

          <AdminManagement/>
          </AdminLayout>
        </ProtectedRoute>
      }
      />


    </Routes>
  );
}

export default App; 

