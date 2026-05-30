import React from 'react'
import Navbar from './components/Navbar.jsx';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import Footer from './components/Footer.jsx';
import Login from './components/Login.jsx';
import { useAppContext } from './context/AppContext.jsx';
import Hotels from './pages/Hotels.jsx';
import AllRooms from './pages/AllRooms';
import MyBookings from './pages/MyBookings';
import MyBookingTrips from './pages/MyBookingTrips.jsx';
import CustomTrips from './pages/CustomTrips.jsx';
import MyCustomTrips from './pages/MyCustomTrips.jsx';
import Layout from './pages/hotelOwner/Layout';
import Dashboard from './pages/hotelOwner/Dashboard';
import AddRoom from './pages/hotelOwner/AddRoom';
import AddHotel from './pages/hotelOwner/AddHotel';
import ListRoom from './pages/hotelOwner/ListRoom';
import ListPackages from './pages/hotelOwner/ListPackages.jsx';
import AddPackage from './pages/hotelOwner/AddPackage.jsx';
import ListCustomTrips from './pages/hotelOwner/ListCustomTrips.jsx';
import Rooms from './pages/Rooms.jsx';
import AccessDenied from './pages/AccessDenied.jsx';
import Trips from './pages/Trips.jsx';
import TripsDetails from './pages/TripsDetails.jsx';
import { Toaster } from "react-hot-toast";
import SearchResults from './pages/SearchResults.jsx';

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

const AnimatedPage = ({ children }) => (
  <motion.div {...pageTransition}>{children}</motion.div>
);

export function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/access-denied" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/access-denied" />;
  return children;
}

const App = () => {
  const location = useLocation();
  const isOwnerPath = location.pathname.includes("owner");
  const { showUserLogin } = useAppContext();

  return (
    <div>
      {isOwnerPath ? null : <Navbar />}
      {showUserLogin ? <Login /> : null}

      <div className={`${isOwnerPath ? "" : "px-0"}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/search" element={<AnimatedPage><SearchResults /></AnimatedPage>} />
            <Route path='/rooms' element={<AnimatedPage><AllRooms /></AnimatedPage>} />
            <Route path="/rooms/:id" element={<AnimatedPage><Rooms /></AnimatedPage>} />
            <Route path='/my-bookings' element={<AnimatedPage><MyBookings /></AnimatedPage>} />
            <Route path='/my-bookings-trips' element={<AnimatedPage><MyBookingTrips /></AnimatedPage>} />
            <Route path='/hotels' element={<AnimatedPage><Hotels /></AnimatedPage>} />
            <Route path='/trips' element={<AnimatedPage><Trips /></AnimatedPage>} />
            <Route path='/trips/:id' element={<AnimatedPage><TripsDetails /></AnimatedPage>} />
            <Route path='/custom-trips' element={<AnimatedPage><CustomTrips /></AnimatedPage>} />
            <Route path='/my-custom-trips' element={<AnimatedPage><MyCustomTrips /></AnimatedPage>} />

            <Route path='/owner' element={<ProtectedRoute allowedRoles={["owner"]}><Layout /></ProtectedRoute>}>
              <Route index element={<AnimatedPage><Dashboard /></AnimatedPage>} />
              <Route path="add-hotel" element={<AnimatedPage><AddHotel /></AnimatedPage>} />
              <Route path="add-room" element={<AnimatedPage><AddRoom /></AnimatedPage>} />
              <Route path="list-room" element={<AnimatedPage><ListRoom /></AnimatedPage>} />
              <Route path="list-packages" element={<AnimatedPage><ListPackages /></AnimatedPage>} />
              <Route path='add-package' element={<AnimatedPage><AddPackage /></AnimatedPage>} />
              <Route path='list-custom-trips' element={<AnimatedPage><ListCustomTrips /></AnimatedPage>} />
            </Route>

            <Route path="/access-denied" element={<AnimatedPage><AccessDenied /></AnimatedPage>} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isOwnerPath && <Footer />}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default App;
