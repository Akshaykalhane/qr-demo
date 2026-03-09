import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/home/HomePage.jsx";
import EmployeePage from "./pages/employee/EmployeePage.jsx";
import RegistrationPage from "./pages/registration/Registration.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/employee" element={<EmployeePage />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}
