
 import React from "react";
 import {
  BrowserRouter as Router,
   Routes,
   Route,
   useLocation,
 } from "react-router-dom";
 import "./App.css";

 import LoginPage from "./components/Login/LoginPage";
 import RegisterPage from "./components/Register/RegisterPage";
 import ChatPage from "./components/Chat/ChatPage";
 import FriendRequests from "./components/Users";
 import FriendSystem from "./components/Friends";
 import Header from "./components/Header";
 import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
 import LandingPage from "./components/LandingPage";
 import PageUnderConstruction from "./components/PageUnderConstruction";
import Notifications from "./components/Notifications";
import Users from "./components/Users";
import Friends from "./components/Friends";

 function AppContent() {
   const location = useLocation();
   const isLoginRoute = location.pathname === "/login";
   const isAuthRoute =
     location.pathname === "/login" || location.pathname === "/register";

   return (
     <div className="App">
       {/* Conditionally render the header only for protected routes */}

      <Routes>
         {/* Public Routes */}
         <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={<LandingPage />} />

       {/* Protected Routes */}
         <Route
           path="/users"
           element={
             <ProtectedRoute isLoginRoute={false}>
               <Users />
             </ProtectedRoute>
           }
         />
         <Route
           path="/friends"
           element={
             <ProtectedRoute isLoginRoute={false}>
               <Friends />
            </ProtectedRoute>
           }
         />
         <Route
           path="/chat"
           element={
             <ProtectedRoute isLoginRoute={false}>
              <ChatPage />
             </ProtectedRoute>
           }
         />
        <Route
           path="/under-construction"
           element={
             <ProtectedRoute isLoginRoute={false}>
              <PageUnderConstruction />
             </ProtectedRoute>
           }
         />

<Route
           path="/notifications"
           element={
             <ProtectedRoute isLoginRoute={false}>
              <Notifications />
             </ProtectedRoute>
           }
         />
       </Routes>
     </div>
  );
 }

 function App() {
   return (
<Router>
       <AppContent />
     </Router>
   );
 }

 export default App;


/*
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import LandingPage from "./sections/LandingPage";

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null; // Change this based on your auth system
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={isAuthenticated() ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
*/