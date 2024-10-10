/** @format */

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import PreviewMap from "./pages/PreviewMap/PreviewMap";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "../src/components/Footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import AboutUs from "./pages/AboutUs/AboutUs"; // Adjust the path if necessary
import RequirementForm from "./pages/RequirementForm/RequirementForm";
import Gallery from "./pages/Gallery/Gallery";
import Regenerate from "./pages/Regenerate/regenerate";
// import RooftopDetection from "./pages/Rooftop/RooftopDetection";

// Import UserProvider to wrap the app
import { UserProvider } from "./context/UserContext";
// import RooftopDetectionPage from "./pages/Rooftop/RooftopDetection";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<Home />} />
            <Route path="/preview" element={<PreviewMap />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/requirementform" element={<RequirementForm />} />
            <Route path="/gallery" element={<Gallery />} />
            {/* Add the Regenerate route */}
            <Route path="/regenerate" element={<Regenerate />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
