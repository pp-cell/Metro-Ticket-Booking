import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Stations from './Components/Stations';
import Routelist from './Components/Routelist';
import Login from './Components/Login';
import Register from './Components/Register';
import Booking from './Components/Booking';
import 'bootstrap/dist/css/bootstrap.min.css';
import TicketConfirmation from './Components/TicketConfirmation';
import { UserProvider } from './UserStore';
import PrivateRoute from './PrivateRoute';
import Navbar from './Components/Navbar';
import ProfilePage from './Components/Profilepage';
import ForgotPassword from "./Components/Forgotpassword";
import ResetPasswords from "./Components/ResetPasswords";


function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar /> 
        <Routes>
          <Route path="/stations" element={<Stations />} />
          <Route path="/routes" element={<Routelist />} />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPasswords />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />  {/* New Route Added */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Booking />} />
            <Route path="/ticket-confirmation" element={<TicketConfirmation />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
