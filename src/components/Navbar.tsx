import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        aboutRef.current &&
        !aboutRef.current.contains(event.target as Node) &&
        servicesRef.current &&
        !servicesRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
        setIsAboutOpen(false);
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to toggle dropdown on click
  const toggleDropdown = (current: boolean, setFunc: (v: boolean) => void) => {
    setFunc(!current);
  };

  return (
    <>
      {/* Sticky Navbar */}
      {/* <div className="p-2 shadow-md bg-cyan-950 w-full">
        <div className="max-w-7xl mx-auto flex justify-center text-white px-4 sm:px-6 lg:px-8">
          <p className="m-3">Welcome to DIFF Medical Centre</p>
        </div>
      </div> */}

      <nav className="bg-white text-black w-full sticky top-0 z-10 p-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold hover:text-gray-300">
                <div className="w-[15rem]">
                  <img src="/logo.png" alt="DMC Logo" />
                </div>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-10 items-center relative">
              <Link
                to="/"
                className="relative hover:text-gray-300 transition-transform duration-300 transform hover:scale-110 
               after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] 
               after:bg-blue-500 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                Home
              </Link>

              {/* About Us Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
                ref={aboutRef}
              >
                <button
                  onClick={() => toggleDropdown(isAboutOpen, setIsAboutOpen)}
                  className="relative flex items-center space-x-1 hover:text-gray-300 transition-transform duration-300 transform hover:scale-110 focus:outline-none
                       after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] 
                       after:bg-blue-500 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  <span>About Us</span>
                  <FaChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isAboutOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-1/2 top-12 -translate-x-1/2 bg-gray-800 text-white shadow-lg rounded-md z-50 min-w-[120px] 
                  transition-all duration-300 transform origin-top ${
                    isAboutOpen
                      ? "opacity-100 scale-y-100 pointer-events-auto"
                      : "opacity-0 scale-y-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
                  <Link
                    to="/about"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    About DIFF
                  </Link>
                  <Link
                    to="/whyus"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Why Us
                  </Link>
                  <Link
                    to="/testimonials"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Testimonials
                  </Link>
                </div>
              </div>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
                ref={servicesRef}
              >
                <button
                  onClick={() =>
                    toggleDropdown(isServicesOpen, setIsServicesOpen)
                  }
                  className="flex items-center space-x-1 hover:text-gray-300 transition-transform duration-300 transform hover:scale-110 focus:outline-none after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] 
               after:bg-blue-500 after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300"
                >
                  <span>Services</span>
                  <FaChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isServicesOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`absolute left-1/2 top-12 -translate-x-1/2 bg-gray-800 text-white shadow-lg rounded-md z-50 min-w-[350px]
                  transition-all duration-300 transform origin-top ${
                    isServicesOpen
                      ? "opacity-100 scale-y-100 pointer-events-auto"
                      : "opacity-0 scale-y-0 pointer-events-none"
                  }`}
                >
                  <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
                  <Link
                    to="/obstetrics-gynecology"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Obstetrics & Gynecology
                  </Link>
                  <Link
                    to="/laboratory-services"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Laboratory Services
                  </Link>
                  <a
                    href="#orthopaedics"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Orthopaedics and Trauma
                  </a>
                  <a
                    href="#rapid-response"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Rapid Response
                  </a>
                  <a
                    href="#paediatrics"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Paediatrics
                  </a>
                  <a
                    href="#surgery"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Surgery
                  </a>
                  <a
                    href="#dental"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Dental Clinic
                  </a>
                  <a
                    href="#radiology"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Radiology
                  </a>
                  <a
                    href="#eye-clinic"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Eye Clinic
                  </a>
                  <a
                    href="#anaesthesia"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Anaesthesia & Intensive Care
                  </a>
                  <a
                    href="#physiotherapy"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Physiotherapy & Rehabilitation
                  </a>
                  <a href="#ent" className="block py-2 px-4 hover:bg-gray-700">
                    E.N.T Clinic
                  </a>
                </div>
              </div>

              {/* Other Links */}
              <Link to="/consultants" className="hover:text-gray-300">
                Consultants
              </Link>
              <Link to="/ContactUs" className="hover:text-gray-300">
                Contact Us
              </Link>
              <Link to="/Blogpost" className="hover:text-gray-300">
                Blogpost
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden z-50">
            <Link to="/" className="block py-2 px-4 text-sm hover:bg-gray-700">
              Home
            </Link>

            {/* About Mobile */}
            <div>
              <button
                onClick={() => toggleDropdown(isAboutOpen, setIsAboutOpen)}
                className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-700"
              >
                About Us
              </button>
              {isAboutOpen && (
                <div className="ml-4">
                  <Link
                    to="/About"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    About DIFF
                  </Link>
                  <Link
                    to="/WhyUs"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Why Us
                  </Link>
                  <Link
                    to="/Testimonials"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Testimonials
                  </Link>
                </div>
              )}
            </div>

            {/* Services Mobile */}
            <div>
              <button
                onClick={() =>
                  toggleDropdown(isServicesOpen, setIsServicesOpen)
                }
                className="block w-full text-left py-2 px-4 text-sm hover:bg-gray-700"
              >
                Services
              </button>
              {isServicesOpen && (
                <div className="ml-4">
                  <Link
                    to="/obstetrics-gynecology"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Obstetrics & Gynecology
                  </Link>
                  <Link
                    to="/laboratory-services"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Laboratory Services
                  </Link>
                  <a
                    href="#orthopaedics"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Orthopaedics and Trauma
                  </a>
                  <a
                    href="#rapid-response"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Rapid Response
                  </a>
                  <a
                    href="#paediatrics"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Paediatrics
                  </a>
                  <a
                    href="#surgery"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Surgery
                  </a>
                  <a
                    href="#dental"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Dental Clinic
                  </a>
                  <a
                    href="#radiology"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Radiology
                  </a>
                  <a
                    href="#eye-clinic"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Eye Clinic
                  </a>
                  <a
                    href="#anaesthesia"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Anaesthesia & Intensive Care
                  </a>
                  <a
                    href="#physiotherapy"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    Physiotherapy & Rehabilitation
                  </a>
                  <a
                    href="#ent"
                    className="block py-2 px-4 text-sm hover:bg-gray-700"
                  >
                    E.N.T Clinic
                  </a>
                </div>
              )}
            </div>

            {/* Other Links */}
            <Link
              to="/consultants"
              className="block py-2 px-4 text-sm hover:bg-gray-200"
            >
              Consultants
            </Link>
            <Link
              to="/ContactUs"
              className="block py-2 px-4 text-sm hover:bg-gray-700"
            >
              Contact Us
            </Link>
            <Link
              to="/Blogpost"
              className="block py-2 px-4 text-sm hover:bg-gray-700"
            >
              Blogpost
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
