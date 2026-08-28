import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyDocument from "./pages/VerifyDocument";
import VerificationResult from "./pages/VerificationResult";
import History from "./pages/History";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        <Route element={<Layout />}>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/verify"
            element={<VerifyDocument />}
          />

          <Route
            path="/verification-result"
            element={<VerificationResult />}
          />

          <Route
            path="/history"
            element={<History />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>


        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}