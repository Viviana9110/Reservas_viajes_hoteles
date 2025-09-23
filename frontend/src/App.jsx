import React from 'react'
import Navbar from './components/Navbar.jsx';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';
import { useAppContext } from './context/AppContext.jsx';
import Hotels from './pages/Hotels.jsx';
import AllRooms from './pages/AllRooms';
import MyBookings from './pages/MyBookings';
import MyBookingTrips from './pages/MyBookingTrips.jsx';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import AddHotel from './pages/hotelOwner/AddHotel';
import ListRoom from './pages/hotelOwner/ListRoom';
import ListPackages from './pages/hotelOwner/ListPackages.jsx';
import AddPackage from './pages/hotelOwner/AddPackage.jsx';
import Rooms from './pages/Rooms.jsx';

import AccessDenied from './pages/AccessDenied.jsx'; // 👈 nuevo import
import Trips from './pages/Trips.jsx';
import TripsDetails from './pages/TripsDetails.jsx';

import { Toaster } from "react-hot-toast";

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAppContext(); // 👈 en lugar de useAuth()

  if (!user) return <Navigate to="/access-denied" />;

  // 👇 Validar role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" />;
  }

  return children;
}

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showUserLogin } = useAppContext();

  return (
    <div>
      {isOwnerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <div className={`${isOwnerPath ? "" : "px-0"}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path="/rooms/:id" element={<Rooms />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/my-bookings-trips' element={<MyBookingTrips />} />
          <Route path='/hotels' element={<Hotels />} />
          <Route path='/trips' element={<Trips/>}/>
          <Route path='/trips/:id' element={<TripsDetails/>}/>
          
          {/* 🔒 Protegidas solo para role=owner */}
          <Route path='/owner' element={ <ProtectedRoute allowedRoles={["owner"]}> <Layout /> </ProtectedRoute> }>
  <Route index element={<Dashboard />} />
  <Route path="add-hotel" element={<AddHotel />} />
  <Route path="add-room" element={<AddRoom />} />
  <Route path="list-room" element={<ListRoom />} />
  <Route path="list-packages" element={<ListPackages/>}/>
  <Route path='add-package' element={<AddPackage/>}/>
</Route>

          {/* 👇 Ruta de acceso denegado */}
          <Route path="/access-denied" element={<AccessDenied />} />
        </Routes>
      </div>

      {!isOwnerPath && <Footer />}

      {/* 🔹 Toaster global */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
