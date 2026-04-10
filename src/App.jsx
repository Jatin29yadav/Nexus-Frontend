import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { Toaster } from "sonner";

import Layout from "./components/Layout";
import { PageTransition } from "./components/PageTransition";
import ProtectedRoute from "./components/ProtectedRoute";
import "lenis/dist/lenis.css";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Booking from "./pages/Booking";
import BookingList from "./pages/BookingList";
import Tournament from "./pages/Tournament";
import TournamentDetails from "./pages/TournamentDetails";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import UpdateBooking from "./components/UpdateBooking";
import Profile from "./pages/Profile";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminHUD from "./pages/admin/AdminHUD";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMessages from "./pages/admin/AdminMessages";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            }
          />
          <Route
            path="gallery"
            element={
              <PageTransition>
                <Gallery />
              </PageTransition>
            }
          />
          <Route
            path="tournament"
            element={
              <PageTransition>
                <Tournament />
              </PageTransition>
            }
          />
          <Route
            path="tournament/:id"
            element={
              <PageTransition>
                <TournamentDetails />
              </PageTransition>
            }
          />
          <Route
            path="contact"
            element={
              <PageTransition>
                <Contact />
              </PageTransition>
            }
          />

          <Route
            path="login"
            element={
              <PageTransition>
                <Login />
              </PageTransition>
            }
          />
          <Route
            path="register"
            element={
              <PageTransition>
                <Register />
              </PageTransition>
            }
          />
          <Route
            path="profile"
            element={
              <PageTransition>
                <Profile />
              </PageTransition>
            }
          />

          <Route
            path="booking"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Booking />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="bookings"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <BookingList />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="booking/update/:id"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <UpdateBooking />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="payment"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Payment />
                </PageTransition>
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <PageTransition>
                <AdminHUD />
              </PageTransition>
            }
          />
          <Route
            path="bookings"
            element={
              <PageTransition>
                <AdminBookings />
              </PageTransition>
            }
          />
          <Route
            path="users"
            element={
              <PageTransition>
                <AdminUsers />
              </PageTransition>
            }
          />
          <Route
            path="settings"
            element={
              <PageTransition>
                <AdminSettings />
              </PageTransition>
            }
          />
          <Route
            path="messages"
            element={
              <PageTransition>
                <AdminMessages />
              </PageTransition>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          className:
            "border border-white/10 bg-[#0a0a0a] text-white font-bold tracking-widest uppercase text-[10px] shadow-[0_0_20px_rgba(168,85,247,0.15)]",
        }}
      />
      <Router>
        <AnimatedRoutes />
      </Router>
    </ReactLenis>
  );
}

export default App;
