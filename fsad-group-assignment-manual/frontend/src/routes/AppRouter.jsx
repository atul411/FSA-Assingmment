import { BrowserRouter as Router, Routes, Route, replace } from "react-router-dom";

import SignOn from "../components/Auth/SignOn";
import Dashboard from "../pages/Dashboard"; // placeholder
import ForgotPassword from "../pages/ForgotPassword"; // placeholder
import CreateAccount from "../pages/CreateAccount"; // placeholder
import { Navigate } from "react-router-dom";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? <Navigate to="/dashboard" replace/> : <SignOn />
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-account" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}
