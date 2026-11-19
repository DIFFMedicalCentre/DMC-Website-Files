import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const NavbarHome = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  // ============================================================
  // MAKE MAIN NAVBAR FIXED AFTER THE WELCOME BAR SCROLLS AWAY
  // ============================================================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ============================================================
  // CLOSE MOBILE MENU WHEN CLICKING/TAPPING OUTSIDE
  // ============================================================
  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      const clickedInsideMenu =
        menuRef.current?.contains(target);

      const clickedMenuButton =
        menuButtonRef.current?.contains(target);

      if (!clickedInsideMenu && !clickedMenuButton) {
        setIsMenuOpen(false);
        setIsAboutOpen(false);
        setIsServicesOpen(false);
      }
    };

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, [isMenuOpen]);

  // ============================================================
  // CLOSE MOBILE MENU WHEN MOUSE LEAVES THE BROWSER WINDOW
  // ============================================================
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleMouseOut = (event: MouseEvent) => {
      // Only apply this behavior on mobile/tablet.
      if (window.innerWidth >= 768) return;

      // relatedTarget === null means the pointer left
      // the browser window completely.
      if (event.relatedTarget !== null) return;

      setIsMenuOpen(false);
      setIsAboutOpen(false);
      setIsServicesOpen(false);
    };

    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isMenuOpen]);

  // ============================================================
  // RESET MOBILE MENU WHEN SCREEN BECOMES DESKTOP
  // ============================================================
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsAboutOpen(false);
        setIsServicesOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ============================================================
  // DROPDOWN TOGGLE
  // ============================================================
  const toggleDropdown = (
    current: boolean,
    setFunc: (value: boolean) => void
  ) => {
    setFunc(!current);
  };

  // ============================================================
  // CLOSE MOBILE MENU
  // ============================================================
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsAboutOpen(false);
    setIsServicesOpen(false);
  };

  return (
    <>
      {/* ========================================================
          WELCOME BAR
          This remains normal and scrolls away
      ========================================================= */}
      <div className="w-full bg-cyan-950 p-2 shadow-md">
        <div className="mx-auto flex max-w-7xl justify-center px-4 text-white sm:px-6 lg:px-8">
          <p className="m-3 text-sm font-medium sm:text-base">
            Welcome to DIFF Medical Centre
          </p>
        </div>
      </div>

      {/* ========================================================
          NAVBAR SPACER
          Keeps page layout from jumping when navbar becomes fixed
      ========================================================= */}
      {isScrolled && <div className="h-[96px] w-full" />}

      {/* ========================================================
          MAIN NAVIGATION
          Sticky/fixed behavior preserved
      ========================================================= */}
      <nav
        className={`
          z-50
          w-full
          bg-white
          p-4
          text-black
          shadow-md
          transition-all
          duration-300
          ${
            isScrolled
              ? "fixed left-0 top-0 shadow-lg"
              : "relative"
          }
        `}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* ==================================================
                LOGO
            ================================================== */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-bold hover:text-gray-300"
              >
                <div className="w-[15rem]">
                  <img
                    src="/logo.png"
                    alt="DMC Logo"
                    className="h-auto w-full object-contain"
                  />
                </div>
              </Link>
            </div>

            {/* ==================================================
                DESKTOP NAVIGATION
            ================================================== */}
            <div className="relative hidden items-center space-x-10 md:flex">

              {/* HOME */}
              <Link
                to="/"
                className="
                  relative
                  transform
                  transition-transform
                  duration-300
                  hover:scale-110
                  hover:text-gray-500
                  after:absolute
                  after:bottom-0
                  after:left-0
                  after:right-0
                  after:h-[2px]
                  after:origin-left
                  after:scale-x-0
                  after:bg-blue-500
                  after:transition-transform
                  after:duration-300
                  hover:after:scale-x-100
                "
              >
                Home
              </Link>

              {/* ==================================================
                  ABOUT US DROPDOWN
              ================================================== */}
              <div
                className="relative"
                onMouseEnter={() => setIsAboutOpen(true)}
                onMouseLeave={() => setIsAboutOpen(false)}
                ref={aboutRef}
              >
                <button
                  onClick={() =>
                    toggleDropdown(
                      isAboutOpen,
                      setIsAboutOpen
                    )
                  }
                  className="
                    relative
                    flex
                    items-center
                    space-x-1
                    transform
                    transition-transform
                    duration-300
                    hover:scale-110
                    hover:text-gray-500
                    focus:outline-none
                    after:absolute
                    after:bottom-0
                    after:left-0
                    after:right-0
                    after:h-[2px]
                    after:origin-left
                    after:scale-x-0
                    after:bg-blue-500
                    after:transition-transform
                    after:duration-300
                    hover:after:scale-x-100
                  "
                >
                  <span>About Us</span>

                  <FaChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isAboutOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  />
                </button>

                {/* ==================================================
                    CLEANER ABOUT DROPDOWN
                ================================================== */}
                <div
                  className={`
                    absolute
                    left-1/2
                    top-12
                    z-[100]
                    w-64
                    -translate-x-1/2
                    transform
                    origin-top
                    rounded-md
                    border
                    border-gray-100
                    bg-white
                    text-gray-700
                    shadow-xl
                    transition-all
                    duration-300
                    ${
                      isAboutOpen
                        ? "pointer-events-auto scale-y-100 opacity-100"
                        : "pointer-events-none scale-y-0 opacity-0"
                    }
                  `}
                >
                  {/* Invisible hover bridge */}
                  <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />

                  <Link
                    to="/about"
                    className="
                      block
                      border-b
                      border-gray-100
                      px-5
                      py-3
                      text-sm
                      text-gray-700
                      transition-colors
                      hover:bg-cyan-50
                      hover:text-cyan-900
                    "
                  >
                    About DIFF
                  </Link>

                  <Link
                    to="/whyus"
                    className="
                      block
                      border-b
                      border-gray-100
                      px-5
                      py-3
                      text-sm
                      text-gray-700
                      transition-colors
                      hover:bg-cyan-50
                      hover:text-cyan-900
                    "
                  >
                    Why Us
                  </Link>

                  <Link
                    to="/testimonials"
                    className="
                      block
                      px-5
                      py-3
                      text-sm
                      text-gray-700
                      transition-colors
                      hover:bg-cyan-50
                      hover:text-cyan-900
                    "
                  >
                    Testimonials
                  </Link>
                </div>
              </div>

              {/* ==================================================
                  SERVICES DROPDOWN
              ================================================== */}
              <div
                className="relative"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
                ref={servicesRef}
              >
                <button
                  onClick={() =>
                    toggleDropdown(
                      isServicesOpen,
                      setIsServicesOpen
                    )
                  }
                  className="
                    relative
                    flex
                    items-center
                    space-x-1
                    transform
                    transition-transform
                    duration-300
                    hover:scale-110
                    hover:text-gray-500
                    focus:outline-none
                    after:absolute
                    after:bottom-0
                    after:left-0
                    after:right-0
                    after:h-[2px]
                    after:origin-left
                    after:scale-x-0
                    after:bg-blue-500
                    after:transition-transform
                    after:duration-300
                    hover:after:scale-x-100
                  "
                >
                  <span>Services</span>

                  <FaChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isServicesOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  />
                </button>

                {/* ==================================================
                {/* SERVICES DROPDOWN */}
                <div className={`absolute left-1/2 top-12 z-[100] w-[42rem] -translate-x-1/2 transform origin-top rounded-md border border-gray-100 bg-white text-gray-700 shadow-xl transition-all duration-300 ${isServicesOpen ? "pointer-events-auto scale-y-100 opacity-100" : "pointer-events-none scale-y-0 opacity-0"}`}>
                  <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
                  <div className="grid grid-cols-2">
                    <div className="border-r border-gray-100">
                      <Link to="/ivf" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">IVF</Link>
                      <a href="#paediatrics" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Paediatrics</a>
                      <a href="#rapid-response" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Rapid Response</a>
                      <a href="#dental" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Dental Clinic</a>
                      <a href="#eye-clinic" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Eye Clinic</a>
                      <a href="#physiotherapy" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Physiotherapy & Rehabilitation</a>
                      <Link to="/renaldialysisspa" className="block px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Renal Dialysis Spa</Link>
                    </div>
                    <div>
                      <Link to="/obygyn" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Obstetrics & Gynaecology</Link>
                      <Link to="/andrology" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Andrology</Link>
                      <a href="#surgery" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Surgery</a>
                      <a href="#radiology" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Radiology</a>
                      <a href="#anaesthesia" className="block border-b border-gray-100 px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">Anaesthesia & Intensive Care</a>
                      <a href="#ent" className="block px-5 py-3 text-sm text-gray-700 transition-colors hover:bg-cyan-50 hover:text-cyan-900">E.N.T Clinic</a>
                    </div>
                  </div>
                </div>
              </div>

             

              <Link
                to="/consultants"
                className="transition-colors hover:text-gray-500"
              >
                Consultants
              </Link>

              <Link
                to="/ContactUs"
                className="transition-colors hover:text-gray-500"
              >
                Contact Us
              </Link>

              <Link
                to="/Blogpost"
                className="transition-colors hover:text-gray-500"
              >
                Blogpost
              </Link>
            </div>

            {/* ==================================================
                MOBILE MENU BUTTON
            ================================================== */}
            <div className="flex items-center md:hidden">
              <button
                ref={menuButtonRef}
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);

                  if (isMenuOpen) {
                    setIsAboutOpen(false);
                    setIsServicesOpen(false);
                  }
                }}
                className="
                  rounded-md
                  p-2
                  text-gray-700
                  transition
                  hover:bg-gray-100
                  hover:text-cyan-950
                  focus:outline-none
                "
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="h-6 w-6"
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
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ======================================================
            MOBILE MENU
            Clean white design
            Remains in normal document flow
        ======================================================= */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="
              relative
              z-[900]
              w-full
              border-t
              border-gray-100
              bg-white
              shadow-lg
              md:hidden
            "
          >
            <div
              className="
                mx-auto
                w-full
                max-w-7xl
                px-4
                py-3
                sm:px-6
              "
            >
              {/* ==================================================
                  HOME
              ================================================== */}
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="
                  block
                  border-b
                  border-gray-100
                  px-4
                  py-4
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  hover:bg-cyan-50
                  hover:text-cyan-900
                "
              >
                Home
              </Link>

              {/* ==================================================
                  ABOUT MOBILE
              ================================================== */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() =>
                    toggleDropdown(
                      isAboutOpen,
                      setIsAboutOpen
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-4
                    py-4
                    text-left
                    text-base
                    font-semibold
                    text-gray-700
                    transition-colors
                    hover:bg-cyan-50
                    hover:text-cyan-900
                  "
                >
                  <span>About Us</span>

                  <FaChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${
                      isAboutOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  />
                </button>

                {isAboutOpen && (
                  <div
                    className="
                      mb-2
                      ml-4
                      border-l-2
                      border-cyan-900
                      bg-gray-50
                    "
                  >
                    <Link
                      to="/About"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      About DIFF
                    </Link>

                    <Link
                      to="/WhyUs"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Why Us
                    </Link>

                    <Link
                      to="/Testimonials"
                      onClick={closeMobileMenu}
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Testimonials
                    </Link>
                  </div>
                )}
              </div>

              {/* ==================================================
                  SERVICES MOBILE
              ================================================== */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() =>
                    toggleDropdown(
                      isServicesOpen,
                      setIsServicesOpen
                    )
                  }
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    px-4
                    py-4
                    text-left
                    text-base
                    font-semibold
                    text-gray-700
                    transition-colors
                    hover:bg-cyan-50
                    hover:text-cyan-900
                  "
                >
                  <span>Services</span>

                  <FaChevronDown
                    size={15}
                    className={`transition-transform duration-300 ${
                      isServicesOpen
                        ? "rotate-180"
                        : "rotate-0"
                    }`}
                  />
                </button>

                {isServicesOpen && (
                  <div
                    className="
                      mb-2
                      ml-4
                      border-l-2
                      border-cyan-900
                      bg-gray-50
                    "
                  >
                    <Link
                      to="/obstetrics-gynecology"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Obstetrics & Gynecology
                    </Link>

                    <Link
                      to="/laboratory-services"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Laboratory Services
                    </Link>

                    <a
                      href="#orthopaedics"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Orthopaedics and Trauma
                    </a>

                    <a
                      href="#rapid-response"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Rapid Response
                    </a>

                    <a
                      href="#paediatrics"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Paediatrics
                    </a>

                    <a
                      href="#surgery"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Surgery
                    </a>

                    <a
                      href="#dental"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Dental Clinic
                    </a>

                    <a
                      href="#radiology"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Radiology
                    </a>

                    <a
                      href="#eye-clinic"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Eye Clinic
                    </a>

                    <a
                      href="#anaesthesia"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Anaesthesia & Intensive Care
                    </a>

                    <a
                      href="#physiotherapy"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Physiotherapy & Rehabilitation
                    </a>

                    <a
                      href="#ent"
                      onClick={closeMobileMenu}
                      className="
                        block
                        border-b
                        border-gray-100
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      E.N.T Clinic
                    </a>

                    <Link
                      to="/renaldialysisspa"
                      onClick={closeMobileMenu}
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        text-gray-700
                        transition-colors
                        hover:bg-cyan-100
                        hover:text-cyan-900
                      "
                    >
                      Renal Dialysis Spa (TKS)
                    </Link>
                  </div>
                )}
              </div>

              {/* ==================================================
                  OTHER MOBILE LINKS
              ================================================== */}

              <Link
                to="/consultants"
                onClick={closeMobileMenu}
                className="
                  block
                  border-b
                  border-gray-100
                  px-4
                  py-4
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  hover:bg-cyan-50
                  hover:text-cyan-900
                "
              >
                Consultants
              </Link>

              <Link
                to="/ContactUs"
                onClick={closeMobileMenu}
                className="
                  block
                  border-b
                  border-gray-100
                  px-4
                  py-4
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  hover:bg-cyan-50
                  hover:text-cyan-900
                "
              >
                Contact Us
              </Link>

              <Link
                to="/Blogpost"
                onClick={closeMobileMenu}
                className="
                  block
                  border-b
                  border-gray-100
                  px-4
                  py-4
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  hover:bg-cyan-50
                  hover:text-cyan-900
                "
              >
                Blogpost
              </Link>

              <Link
                to="/renaldialysisspa"
                onClick={closeMobileMenu}
                className="
                  block
                  px-4
                  py-4
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  hover:bg-cyan-50
                  hover:text-cyan-900
                "
              >
                Renal Dialysis Spa (TKS)
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default NavbarHome;