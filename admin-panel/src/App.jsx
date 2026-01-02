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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-event"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-event/:id"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
    
<Route 
path="/events"
element={
  <ProtectedRoute>
    <Events/>
  </ProtectedRoute>
}
/>

<Route
path="/event-registrations"
element={
  <ProtectedRoute>
    <EventRegistrations/>
  </ProtectedRoute>
}
/>

<Route
path='/members'
element={
  <ProtectedRoute>
    <Members/>
  </ProtectedRoute>
}
/>
      <Route 
      path='/membership'
      element={
        <ProtectedRoute>
          <MembershipApproval/>
        </ProtectedRoute>
      }
      />

      <Route
      path='/sendnotification'
      element={
        <ProtectedRoute>
          <Notification/>
        </ProtectedRoute>
      }
      /> 

      <Route
      path="/event-management"
      element={
        <ProtectedRoute>
          <EventManagement/>
        </ProtectedRoute>
      }
      />

      <Route
      path="/event-management/:eventId"
      element={
        <ProtectedRoute>
          <EventDetails/>
        </ProtectedRoute>
      }
      />


    </Routes>
  );
}

export default App;

