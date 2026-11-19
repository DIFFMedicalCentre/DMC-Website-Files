import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileAboutOpen(false);
    setIsMobileServicesOpen(false);
  };

  return (
    <nav className="sticky top-0 z-[1000] w-full bg-white shadow-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* =========================
            LOGO
        ========================== */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center"
        >
          <img
            src="/logo.png"
            alt="DIFF Medical Centre"
            className="h-16 w-auto object-contain"
          />
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <div className="hidden items-center gap-1 lg:flex">

          {/* HOME */}
          <Link
            to="/"
            className="
              rounded-md
              px-4
              py-3
              text-base
              font-normal
              text-gray-700
              transition-all
              duration-200
              hover:bg-cyan-50
              hover:text-cyan-700
            "
          >
            Home
          </Link>

          {/* =========================
              ABOUT US - HOVER DROPDOWN
          ========================== */}
          <div className="group relative">

            <button
              type="button"
              className="
                flex
                items-center
                gap-2
                rounded-md
                px-4
                py-3
                text-base
                font-semibold
                text-gray-700
                transition-all
                duration-200
                hover:bg-cyan-50
                hover:text-cyan-700
              "
            >
              About Us

              <FaChevronDown
                className="
                  text-[10px]
                  transition-transform
                  duration-200
                  group-hover:rotate-180
                "
              />
            </button>

            {/* ABOUT DROPDOWN */}
            <div
              className="
                invisible
                absolute
                left-0
                top-full
                z-[1100]
                mt-1
                w-64
                translate-y-2
                overflow-hidden
                rounded-lg
                border
                border-gray-100
                bg-white
                opacity-0
                shadow-xl
                transition-all
                duration-200
                group-hover:visible
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
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
                  duration-200
                  hover:bg-cyan-50
                  hover:text-cyan-700
                "
              >
                About DIFF
              </Link>

              <Link
                to="/why-us"
                className="
                  block
                  border-b
                  border-gray-100
                  px-5
                  py-3
                  text-sm
                  text-gray-700
                  transition-colors
                  duration-200
                  hover:bg-cyan-50
                  hover:text-cyan-700
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
                  duration-200
                  hover:bg-cyan-50
                  hover:text-cyan-700
                "
              >
                Testimonials
              </Link>
            </div>
          </div>

          {/* =========================
              SERVICES - HOVER DROPDOWN
          ========================== */}
          <div className="group relative">

            <button
              type="button"
              className="
                flex
                items-center
                gap-2
                rounded-md
                px-4
                py-3
                text-base
                font-semibold
                text-gray-700
                transition-all
                duration-200
                hover:bg-cyan-50
                hover:text-cyan-700
              "
            >
              Services

              <FaChevronDown
                className="
                  text-[10px]
                  transition-transform
                  duration-200
                  group-hover:rotate-180
                "
              />
            </button>

            {/* SERVICES DROPDOWN */}
            <div
              className="
                invisible
                absolute
                left-1/2
                top-full
                z-[1100]
                mt-1
                w-[min(650px,calc(100vw-32px))]
                -translate-x-1/2
                translate-y-2
                overflow-hidden
                rounded-lg
                border
                border-gray-100
                bg-white
                opacity-0
                shadow-2xl
                transition-all
                duration-200
                group-hover:visible
                group-hover:translate-y-0
                group-hover:opacity-100
              "
            >
              <div className="grid grid-cols-1 sm:grid-cols-2">

                {/* IVF */}
                <Link
                  to="/ivf"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    sm:border-r
                  "
                >
                  IVF
                </Link>

                {/* Obstetrics & Gynaecology */}
                <Link
                  to="/obstetrics-gynaecology"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                  "
                >
                  Obstetrics &amp; Gynaecology
                </Link>

                {/* Paediatrics */}
                <Link
                  to="/paediatrics"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    sm:border-r
                  "
                >
                  Paediatrics
                </Link>

                {/* Andrology */}
                <Link
                  to="/andrology"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                  "
                >
                  Andrology
                </Link>

                {/* Rapid Response */}
                <Link
                  to="/rapid-response"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    sm:border-r
                  "
                >
                  Rapid Response
                </Link>

                {/* Surgery */}
                <Link
                  to="/surgery"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                  "
                >
                  Surgery
                </Link>

                {/* Dental Clinic */}
                <Link
                  to="/dental-clinic"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    sm:border-r
                  "
                >
                  Dental Clinic
                </Link>

                {/* Radiology */}
                <Link
                  to="/radiology"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                  "
                >
                  Radiology
                </Link>

                {/* Eye Clinic */}
                <Link
                  to="/eye-clinic"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    sm:border-r
                  "
                >
                  Eye Clinic
                </Link>

                {/* Anaesthesia & Intensive Care */}
                <Link
                  to="/anaesthesia-intensive-care"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                  "
                >
                  Anaesthesia &amp; Intensive Care
                </Link>

                {/* Physiotherapy & Rehabilitation */}
                <Link
                  to="/physiotherapy-rehabilitation"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    sm:border-r
                  "
                >
                  Physiotherapy &amp; Rehabilitation
                </Link>

                {/* E.N.T Clinic */}
                <Link
                  to="/ent-clinic"
                  className="
                    block
                    border-b
                    border-gray-100
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                  "
                >
                  E.N.T Clinic
                </Link>

                {/* RENAL DIALYSIS SPA */}
                <Link
                  to="/renaldialysisspa"
                  className="
                    block
                    px-5
                    py-3
                    text-sm
                    text-gray-700
                    transition-colors
                    duration-200
                    hover:bg-cyan-50
                    hover:text-cyan-700
                    sm:border-r
                  "
                >
                  Renal Dialysis Spa
                </Link>

              </div>
            </div>
          </div>

          {/* CONSULTANTS */}
          <Link
            to="/consultants"
            className="
              rounded-md
              px-4
              py-3
              text-base
              font-normal
              text-gray-700
              transition-all
              duration-200
              hover:bg-cyan-50
              hover:text-cyan-700
            "
          >
            Consultants
          </Link>

          {/* CONTACT US */}
          <Link
            to="/contact"
            className="
              rounded-md
              px-4
              py-3
              text-base
              font-normal
              text-gray-700
              transition-all
              duration-200
              hover:bg-cyan-50
              hover:text-cyan-700
            "
          >
            Contact Us
          </Link>

          {/* BLOGPOST */}
          <Link
            to="/blogpost"
            className="
              rounded-md
              px-4
              py-3
              text-base
              font-normal
              text-gray-700
              transition-all
              duration-200
              hover:bg-cyan-50
              hover:text-cyan-700
            "
          >
            Blogpost
          </Link>
        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}
        <button
          type="button"
          onClick={() =>
            setIsMobileMenuOpen((prev) => !prev)
          }
          className="
            rounded-md
            p-2
            text-2xl
            text-gray-700
            transition-colors
            duration-200
            hover:bg-cyan-50
            hover:text-cyan-700
            lg:hidden
          "
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      {isMobileMenuOpen && (
        <div
          className="
            max-h-[calc(100vh-80px)]
            overflow-y-auto
            border-t
            border-gray-100
            bg-white
            shadow-lg
            lg:hidden
          "
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">

            {/* HOME */}
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="
                block
                rounded-md
                px-4
                py-3
                text-base
                font-semibold
                text-gray-700
                transition-colors
                duration-200
                hover:bg-cyan-50
                hover:text-cyan-700
              "
            >
              Home
            </Link>

            {/* =========================
                MOBILE ABOUT
            ========================== */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setIsMobileAboutOpen((prev) => !prev)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-md
                  px-4
                  py-3
                  text-left
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  duration-200
                  hover:bg-cyan-50
                  hover:text-cyan-700
                "
              >
                <span>About Us</span>

                <FaChevronDown
                  className={`text-[10px] transition-transform duration-200 ${
                    isMobileAboutOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileAboutOpen && (
                <div className="ml-4 border-l-2 border-cyan-100 pl-2">

                  <Link
                    to="/about"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    About DIFF
                  </Link>

                  <Link
                    to="/why-us"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Why Us
                  </Link>

                  <Link
                    to="/testimonials"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Testimonials
                  </Link>

                </div>
              )}
            </div>

            {/* =========================
                MOBILE SERVICES
            ========================== */}
            <div>
              <button
                type="button"
                onClick={() =>
                  setIsMobileServicesOpen((prev) => !prev)
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-md
                  px-4
                  py-3
                  text-left
                  text-base
                  font-semibold
                  text-gray-700
                  transition-colors
                  duration-200
                  hover:bg-cyan-50
                  hover:text-cyan-700
                "
              >
                <span>Services</span>

                <FaChevronDown
                  className={`text-[10px] transition-transform duration-200 ${
                    isMobileServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMobileServicesOpen && (
                <div className="ml-4 border-l-2 border-cyan-100 pl-2">

                  <Link
                    to="/ivf"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    IVF
                  </Link>

                  <Link
                    to="/obstetrics-gynaecology"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Obstetrics &amp; Gynaecology
                  </Link>

                  <Link
                    to="/paediatrics"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Paediatrics
                  </Link>

                  <Link
                    to="/andrology"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Andrology
                  </Link>

                  <Link
                    to="/rapid-response"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Rapid Response
                  </Link>

                  <Link
                    to="/surgery"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Surgery
                  </Link>

                  <Link
                    to="/dental-clinic"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Dental Clinic
                  </Link>

                  <Link
                    to="/radiology"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Radiology
                  </Link>

                  <Link
                    to="/eye-clinic"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Eye Clinic
                  </Link>

                  <Link
                    to="/anaesthesia-intensive-care"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Anaesthesia &amp; Intensive Care
                  </Link>

                  <Link
                    to="/physiotherapy-rehabilitation"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Physiotherapy &amp; Rehabilitation
                  </Link>

                  <Link
                    to="/ent-clinic"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    E.N.T Clinic
                  </Link>

                  {/* RENAL DIALYSIS SPA */}
                  <Link
                    to="/renaldialysisspa"
                    onClick={closeMobileMenu}
                    className="
                      block
                      rounded-md
                      px-4
                      py-3
                      text-sm
                      text-gray-600
                      hover:bg-cyan-50
                      hover:text-cyan-700
                    "
                  >
                    Renal Dialysis Spa
                  </Link>

                </div>
              )}
            </div>

            {/* CONSULTANTS */}
            <Link
              to="/consultants"
              onClick={closeMobileMenu}
              className="
                block
                rounded-md
                px-4
                py-3
                text-base
                font-semibold
                text-gray-700
                transition-colors
                duration-200
                hover:bg-cyan-50
                hover:text-cyan-700
              "
            >
              Consultants
            </Link>

            {/* CONTACT US */}
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="
                block
                rounded-md
                px-4
                py-3
                text-base
                font-semibold
                text-gray-700
                transition-colors
                duration-200
                hover:bg-cyan-50
                hover:text-cyan-700
              "
            >
              Contact Us
            </Link>

            {/* BLOGPOST */}
            <Link
              to="/blogpost"
              onClick={closeMobileMenu}
              className="
                block
                rounded-md
                px-4
                py-3
                text-base
                font-semibold
                text-gray-700
                transition-colors
                duration-200
                hover:bg-cyan-50
                hover:text-cyan-700
              "
            >
              Blogpost
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;