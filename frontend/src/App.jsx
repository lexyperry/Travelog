import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import TripDetail from "./pages/TripDetail";
import AddTrip from "./pages/AddTrip";
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute><Trips /></ProtectedRoute>
          } />
          <Route path="/trips/:id" element={
            <ProtectedRoute><TripDetail /></ProtectedRoute>} 
          />
          <Route path="/trips/new" element={<ProtectedRoute><AddTrip /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}