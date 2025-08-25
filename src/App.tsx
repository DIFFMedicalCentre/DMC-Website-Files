import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/ContactUs";
import Appointment from "./pages/Appointment";
import NoPage from "./pages/NoPage";
import WhyUs from "./pages/WhyUs";
import Testimonials from "./pages/Testimonials";
import Consultants from "./pages/Consultants";
import ConsultantDetails from "./components/consultants/ConsultantsDetails";
import ConsultantsList from "./pages/Consultants";
import Obgyn from "./pages/Obgyn";
import InPersonBookNow from "./pages/InPersonBookNow";
import VirtualBookNow from "./pages/VirtualBookNow";
import ContactUs from "./pages/ContactUs";
import Blogpost from "./pages/Blogpost";
import Feedbackform from "./pages/Feedbackform";

const App = () => {
  return (
    <div>
      {/* ScrollToTop will now work on every route */}
      <ScrollToTop />

      <Routes>
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/inpersonbooknow" element={<InPersonBookNow />} />
        <Route path="/whyus" element={<WhyUs />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/consultants" element={<Consultants />} />
        <Route path="/" element={<ConsultantsList />} />
        <Route path="/consultant/:id" element={<ConsultantDetails />} />
        <Route path="/obstetrics-gynecology" element={<Obgyn />} />
        <Route path="/virtualbooknow" element={<VirtualBookNow />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/blogpost" element={<Blogpost />} />
        <Route path="/feedbackform" element={<Feedbackform />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </div>
  );
};

export default App;
