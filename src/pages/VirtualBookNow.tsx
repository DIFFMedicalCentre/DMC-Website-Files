
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Gender = "Male" | "Female" | "";

type Currency = "NGN" | "USD";

type Consultant = {
  id: string;
  name: string;
  role: string;
  fee: number;
  currency: Currency;
  category: string;
  initials: string;
};

const procedures = [
  "Medical Examination",
  "Doctor Checkup",
  "Result Analysis",
  "Checkup",
  "Medical Inquiry",
];

const consultants: Consultant[] = [
  {
    id: "john-idahosa",
    name: "Dr. John Idahosa",
    role: "Chief Medical Director",
    fee: 200,
    currency: "USD",
    category: "Consultants",
    initials: "JI",
  },
  {
    id: "ifedi-okonkwo",
    name: "Dr. Ifedi Okonkwo",
    role: "Director of Clinical Services",
    fee: 100000,
    currency: "NGN",
    category: "Consultants",
    initials: "IO",
  },
  {
    id: "dauda-deba-barau",
    name: "Dr. Dauda Deba Barau",
    role: "Head of O & G",
    fee: 100000,
    currency: "NGN",
    category: "Consultants",
    initials: "DB",
  },
  {
    id: "adesuwa-evans-ogbebor",
    name: "Dr. Adesuwa Evans-Ogbebor",
    role: "Embryology Laboratory Director",
    fee: 170000,
    currency: "NGN",
    category: "Embryology Laboratory Director",
    initials: "AE",
  },
];

const formatDate = (date: Date | null) => {
  if (!date) return "Not selected";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Use local calendar dates to avoid UTC date shifting.
const toLocalDateString = (date: Date | null) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatCurrency = (amount: number, currency: Currency) =>
  new Intl.NumberFormat(currency === "NGN" ? "en-NG" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);

const VirtualBookNow = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Patient information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [previousPatient, setPreviousPatient] = useState("");

  // Appointment information
  const [procedure, setProcedure] = useState("");
  const [selectedConsultantId, setSelectedConsultantId] = useState("");
  const [appointmentDate, setAppointmentDate] =
    useState<Date | null>(null);
  const [appointmentTime, setAppointmentTime] = useState("");

  const selectedConsultant = useMemo(
    () => consultants.find((item) => item.id === selectedConsultantId),
    [selectedConsultantId]
  );

  const consultationFee = selectedConsultant?.fee ?? 0;
  const feeCurrency = selectedConsultant?.currency ?? "NGN";

  const groupedConsultants = useMemo(() => {
    return consultants.reduce<Record<string, Consultant[]>>(
      (groups, item) => {
        if (!groups[item.category]) {
          groups[item.category] = [];
        }

        groups[item.category].push(item);
        return groups;
      },
      {}
    );
  }, []);

  // Patient validation
  const validatePatientDetails = () => {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !dateOfBirth ||
      !gender ||
      !phoneNumber.trim() ||
      !address.trim() ||
      !previousPatient
    ) {
      setError("Please complete all patient details before proceeding.");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (dateOfBirth > new Date()) {
      setError("Date of birth cannot be in the future.");
      return false;
    }

    setError("");
    return true;
  };

  // Appointment validation
  const validateAppointment = () => {
    if (
      !procedure ||
      !selectedConsultant ||
      !appointmentDate ||
      !appointmentTime
    ) {
      setError(
        "Please select a service, consultant, appointment date and time."
      );
      return false;
    }

    setError("");
    return true;
  };

  // Secure payment initialization request
  const handlePayment = async () => {
    if (!selectedConsultant) {
      setError("Please select a consultant before proceeding.");
      return;
    }

    if (!consultationFee || consultationFee <= 0) {
      setError("The selected consultation fee is unavailable.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/.netlify/functions/initialize-virtual-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient: {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
              dateOfBirth: toLocalDateString(dateOfBirth),
              gender,
              phoneNumber: phoneNumber.trim(),
              address: address.trim(),
              previousPatient,
            },
            appointment: {
              consultationType: "Virtual",
              procedure,
              consultantId: selectedConsultant.id,
              consultantName: selectedConsultant.name,
              consultantRole: selectedConsultant.role,
              appointmentDate: toLocalDateString(appointmentDate),
              appointmentTime,
            },
            requestedFee: {
              amount: consultationFee,
              currency: feeCurrency,
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.authorization_url) {
        throw new Error(
          result.message ||
            "Unable to initiate payment. Please try again."
        );
      }

      // Redirect to secure payment checkout.
      window.location.href = result.authorization_url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );

      setLoading(false);
    }
  };

  const handleConsultantSelection = (id: string) => {
    setSelectedConsultantId(id);
    setError("");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">

          {/* PAGE HEADER */}
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-sky-900">
              DIFF Medical Centre
            </span>

            <h1 className="text-3xl font-bold tracking-tight text-[#092957] sm:text-4xl lg:text-5xl">
              Virtual Consultation
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Book a virtual consultation with our medical team
              from the comfort and privacy of your home.
            </p>
          </div>

          {/* BOOKING LAYOUT */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

            {/* MAIN FORM */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">

              {/* PROGRESS */}
              <div className="mb-8 grid grid-cols-3 gap-2">
                {[
                  "Patient Details",
                  "Appointment",
                  "Review & Payment",
                ].map((label, index) => {
                  const currentStep = index + 1;

                  return (
                    <div key={label} className="text-center">
                      <div
                        className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                          step >= currentStep
                            ? "bg-[#092957] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {currentStep}
                      </div>

                      <span
                        className={`text-xs font-medium sm:text-sm ${
                          step >= currentStep
                            ? "text-[#092957]"
                            : "text-slate-400"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <div
                  role="alert"
                  className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">

                {/* STEP 1: PATIENT DETAILS */}
                {step === 1 && (
                  <motion.div
                    key="patient-details"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-2 text-xl font-bold text-[#092957] sm:text-2xl">
                      Patient Details
                    </h2>

                    <p className="mb-7 text-sm text-slate-500">
                      Please provide accurate information for your consultation.
                    </p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                      <Field label="First Name">
                        <input
                          required
                          value={firstName}
                          onChange={(e) =>
                            setFirstName(e.target.value)
                          }
                          placeholder="Enter first name"
                          className="input-field"
                        />
                      </Field>

                      <Field label="Last Name">
                        <input
                          required
                          value={lastName}
                          onChange={(e) =>
                            setLastName(e.target.value)
                          }
                          placeholder="Enter last name"
                          className="input-field"
                        />
                      </Field>

                      <Field label="Email Address">
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) =>
                            setEmail(e.target.value)
                          }
                          placeholder="you@example.com"
                          className="input-field"
                        />
                      </Field>

                      <Field label="Phone Number">
                        <input
                          required
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) =>
                            setPhoneNumber(e.target.value)
                          }
                          placeholder="Enter phone number"
                          className="input-field"
                        />
                      </Field>

                      <Field label="Date of Birth">
                        <DatePicker
                          selected={dateOfBirth}
                          onChange={setDateOfBirth}
                          dateFormat="dd/MM/yyyy"
                          maxDate={new Date()}
                          showYearDropdown
                          scrollableYearDropdown
                          yearDropdownItemNumber={100}
                          placeholderText="Select date of birth"
                          className="input-field"
                          wrapperClassName="w-full"
                        />
                      </Field>

                      <Field label="Gender">
                        <select
                          required
                          value={gender}
                          onChange={(e) =>
                            setGender(e.target.value as Gender)
                          }
                          className="input-field"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </Field>

                      <Field label="Address">
                        <input
                          required
                          value={address}
                          onChange={(e) =>
                            setAddress(e.target.value)
                          }
                          placeholder="Residential address"
                          className="input-field"
                        />
                      </Field>

                      <Field label="Have you visited DMC before?">
                        <select
                          required
                          value={previousPatient}
                          onChange={(e) =>
                            setPreviousPatient(e.target.value)
                          }
                          className="input-field"
                        >
                          <option value="">Select an option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                      </Field>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (validatePatientDetails()) {
                            setStep(2);
                          }
                        }}
                        className="rounded-xl bg-[#092957] px-8 py-3 font-semibold text-white transition hover:bg-sky-900"
                      >
                        Continue to Appointment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: APPOINTMENT */}
                {step === 2 && (
                  <motion.div
                    key="appointment"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="mb-2 text-xl font-bold text-[#092957] sm:text-2xl">
                      Appointment Details
                    </h2>

                    <p className="mb-7 text-sm text-slate-500">
                      Select your service, preferred consultant and appointment time.
                    </p>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                      <Field label="Consultation Type">
                        <input
                          readOnly
                          value="Virtual Consultation"
                          className="input-field bg-slate-50"
                        />
                      </Field>

                      <Field label="Procedure / Service">
                        <select
                          required
                          value={procedure}
                          onChange={(e) =>
                            setProcedure(e.target.value)
                          }
                          className="input-field"
                        >
                          <option value="">Select procedure</option>

                          {procedures.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    {/* CONSULTANT SELECTION */}
                    <div className="mt-9">
                      <div className="mb-5">
                        <h3 className="text-lg font-extrabold text-[#092957]">
                          Whom to consult with
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Select your preferred consultant or specialist.
                          Their consultation fee will be displayed on selection.
                        </p>
                      </div>

                      <div className="space-y-8">
                        {Object.entries(groupedConsultants).map(
                          ([category, people]) => (
                            <div key={category}>
                              <h4 className="mb-4 border-b border-slate-100 pb-2 text-xs font-extrabold uppercase tracking-[0.14em] text-cyan-700">
                                {category}
                              </h4>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {people.map((person) => {
                                  const selected =
                                    selectedConsultantId === person.id;

                                  return (
                                    <motion.button
                                      key={person.id}
                                      type="button"
                                      aria-pressed={selected}
                                      onClick={() =>
                                        handleConsultantSelection(person.id)
                                      }
                                      whileHover={{
                                        y: -5,
                                        rotateX: 2,
                                        rotateY: -1,
                                      }}
                                      whileTap={{ scale: 0.98 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 250,
                                        damping: 18,
                                      }}
                                      style={{
                                        transformStyle: "preserve-3d",
                                        perspective: 1000,
                                      }}
                                      className={`relative overflow-hidden rounded-2xl border p-4 text-left shadow-sm transition-all duration-300 ${
                                        selected
                                          ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100 shadow-lg"
                                          : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-lg"
                                      }`}
                                    >
                                      <div className="flex items-start gap-3">
                                        <div
                                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-extrabold shadow-sm ${
                                            selected
                                              ? "bg-[#092957] text-white"
                                              : "bg-gradient-to-br from-blue-100 to-cyan-100 text-[#092957]"
                                          }`}
                                        >
                                          {person.initials}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <p className="font-extrabold leading-5 text-[#092957]">
                                            {person.name}
                                          </p>

                                          <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {person.role}
                                          </p>

                                          <div className="mt-3">
                                            <span className="text-xs font-bold text-cyan-700">
                                              {formatCurrency(
                                                person.fee,
                                                person.currency
                                              )}
                                            </span>

                                            <span className="ml-1 text-[10px] text-slate-400">
                                              consultation fee
                                            </span>
                                          </div>
                                        </div>

                                        <span
                                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                                            selected
                                              ? "border-cyan-600 bg-cyan-600 text-white"
                                              : "border-slate-300 bg-white"
                                          }`}
                                        >
                                          {selected ? "✓" : ""}
                                        </span>
                                      </div>

                                      {selected && (
                                        <motion.div
                                          initial={{
                                            opacity: 0,
                                            scaleX: 0,
                                          }}
                                          animate={{
                                            opacity: 1,
                                            scaleX: 1,
                                          }}
                                          className="absolute bottom-0 left-0 h-1 w-full origin-left bg-cyan-500"
                                        />
                                      )}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {!selectedConsultant && (
                        <p className="mt-4 text-xs text-slate-500">
                          Please select a consultant to continue.
                        </p>
                      )}
                    </div>

                    {/* SELECTED CONSULTANT FEE */}
                    <AnimatePresence mode="wait">
                      {selectedConsultant && (
                        <motion.div
                          key={selectedConsultant.id}
                          initial={{
                            opacity: 0,
                            y: 12,
                            scale: 0.98,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            y: -8,
                          }}
                          transition={{ duration: 0.25 }}
                          className="mt-7 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 p-5"
                        >
                          <p className="text-xs font-bold uppercase tracking-wider text-cyan-700">
                            Selected Consultant
                          </p>

                          <div className="mt-2 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                            <div>
                              <p className="font-extrabold text-[#092957]">
                                {selectedConsultant.name}
                              </p>

                              <p className="mt-1 text-xs text-slate-600">
                                {selectedConsultant.role}
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-xs text-slate-500">
                                Consultation Fee
                              </p>

                              <p className="text-xl font-extrabold text-[#092957]">
                                {formatCurrency(
                                  consultationFee,
                                  feeCurrency
                                )}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* DATE AND TIME */}
                    <div className="mt-9 border-t border-slate-100 pt-7">
                      <h3 className="mb-5 text-lg font-extrabold text-[#092957]">
                        Preferred Appointment Schedule
                      </h3>

                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Field label="Appointment Date">
                          <DatePicker
                            selected={appointmentDate}
                            onChange={(date) => {
                              setAppointmentDate(date);
                              setError("");
                            }}
                            dateFormat="dd/MM/yyyy"
                            minDate={new Date()}
                            placeholderText="Select appointment date"
                            className="input-field"
                            wrapperClassName="w-full"
                          />
                        </Field>

                        <Field label="Preferred Appointment Time">
                          <input
                            required
                            type="time"
                            value={appointmentTime}
                            onChange={(e) =>
                              setAppointmentTime(e.target.value)
                            }
                            className="input-field"
                          />
                        </Field>
                      </div>

                      <p className="mt-5 rounded-lg bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                        Your preferred date and time will be checked
                        against DIFF Medical Centre's appointment availability.
                        Selecting a time does not by itself confirm a booking.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setStep(1);
                        }}
                        className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (validateAppointment()) {
                            setStep(3);
                          }
                        }}
                        className="rounded-xl bg-[#092957] px-8 py-3 font-semibold text-white transition hover:bg-sky-900"
                      >
                        Review Booking
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: REVIEW AND PAYMENT */}
                {step === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-7">
                      <h2 className="mb-2 text-xl font-bold text-[#092957] sm:text-2xl">
                        Review & Confirm
                      </h2>

                      <p className="text-sm leading-6 text-slate-500">
                        Please carefully review your patient details and
                        appointment information before proceeding to payment.
                      </p>
                    </div>

                    {/* PATIENT DETAILS */}
                    <ReviewSection title="Patient Details">
                      <ReviewItem
                        label="Patient Type"
                        value={
                          previousPatient === "Yes"
                            ? "Existing DMC Patient"
                            : "New Patient"
                        }
                      />

                      <ReviewItem
                        label="First Name"
                        value={firstName}
                      />

                      <ReviewItem
                        label="Last Name"
                        value={lastName}
                      />

                      <ReviewItem
                        label="Email Address"
                        value={email}
                      />

                      <ReviewItem
                        label="Phone Number"
                        value={phoneNumber}
                      />

                      <ReviewItem
                        label="Date of Birth"
                        value={formatDate(dateOfBirth)}
                      />

                      <ReviewItem
                        label="Gender"
                        value={gender}
                      />

                      <ReviewItem
                        label="Residential Address"
                        value={address}
                      />

                      <ReviewItem
                        label="Previously Visited DMC"
                        value={previousPatient}
                      />
                    </ReviewSection>

                    {/* APPOINTMENT DETAILS */}
                    <ReviewSection title="Appointment Details">
                      <ReviewItem
                        label="Consultation Type"
                        value="Virtual Consultation"
                      />

                      <ReviewItem
                        label="Procedure / Service"
                        value={procedure}
                      />

                      <ReviewItem
                        label="Consultant"
                        value={selectedConsultant?.name ?? "Not selected"}
                      />

                      <ReviewItem
                        label="Consultant's Role"
                        value={selectedConsultant?.role ?? "Not selected"}
                      />

                      <ReviewItem
                        label="Appointment Date"
                        value={formatDate(appointmentDate)}
                      />

                      <ReviewItem
                        label="Preferred Time"
                        value={appointmentTime}
                      />
                    </ReviewSection>

                    {/* PAYMENT SUMMARY */}
                    <div className="mt-6 overflow-hidden rounded-xl border border-cyan-200 bg-cyan-50">
                      <div className="p-5">
                        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-cyan-800">
                          Payment Summary
                        </p>

                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-[#092957]">
                              Virtual Consultation Fee
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {selectedConsultant?.name}
                            </p>
                          </div>

                          <p className="shrink-0 text-xl font-extrabold text-[#092957]">
                            {formatCurrency(
                              consultationFee,
                              feeCurrency
                            )}
                          </p>
                        </div>

                        <div className="mt-5 border-t border-cyan-200 pt-4">
                          <div className="flex items-center justify-between gap-4">
                            <span className="font-bold text-[#092957]">
                              Total Payable
                            </span>

                            <span className="text-2xl font-extrabold text-[#092957]">
                              {formatCurrency(
                                consultationFee,
                                feeCurrency
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-cyan-200 bg-white/70 px-5 py-4 text-xs leading-6 text-slate-600">
                        Payment is required before your virtual appointment
                        can be confirmed. Your appointment remains subject to
                        availability confirmation by DMC.
                      </div>
                    </div>

                    <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                      Please ensure that all the information above is correct.
                      If you need to make any changes, use the Back button
                      before proceeding.
                    </div>

                    <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setStep(2);
                        }}
                        disabled={loading}
                        className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        disabled={loading || !selectedConsultant}
                        onClick={handlePayment}
                        className="rounded-xl bg-[#092957] px-8 py-3 font-semibold text-white transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-400"
                      >
                        {loading
                          ? "Preparing Secure Payment..."
                          : "Pay & Book Appointment"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* BOOKING SUMMARY SIDEBAR */}
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#092957]">
                Booking Summary
              </h3>

              <div className="mt-5 space-y-4 text-sm">
                <SummaryItem
                  label="Appointment Type"
                  value="Virtual Consultation"
                />

                <SummaryItem
                  label="Patient"
                  value={
                    firstName || lastName
                      ? `${firstName} ${lastName}`.trim()
                      : "Not provided"
                  }
                />

                <SummaryItem
                  label="Procedure"
                  value={procedure || "Not selected"}
                />

                <SummaryItem
                  label="Consultant"
                  value={selectedConsultant?.name || "Not selected"}
                />

                <SummaryItem
                  label="Date"
                  value={formatDate(appointmentDate)}
                />

                <SummaryItem
                  label="Time"
                  value={appointmentTime || "Not selected"}
                />
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-700">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#092957]">
                    {selectedConsultant
                      ? formatCurrency(consultationFee, feeCurrency)
                      : "Not selected"}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                Your information will be handled securely in accordance
                with DMC's patient privacy requirements.
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      {/* LOCAL TAILWIND UTILITY STYLES */}
      <style>{`
        .input-field {
          width: 100%;
          min-height: 48px;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          padding: 10px 12px;
          background: white;
          color: #0f172a;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-field:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.12);
        }
      `}</style>
    </>
  );
};

// REUSABLE FORM FIELD
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-slate-700">
      {label}
    </label>

    {children}
  </div>
);

// REVIEW SECTION
const ReviewSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <h3 className="mb-4 border-b border-slate-100 pb-3 font-bold text-[#092957]">
      {title}
    </h3>

    <div className="space-y-3">{children}</div>
  </div>
);

// REVIEW ITEM
const ReviewItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col justify-between gap-1 border-b border-slate-100 pb-2 last:border-0 sm:flex-row sm:gap-4">
    <span className="text-sm text-slate-500">{label}</span>

    <span className="break-words text-sm font-medium text-slate-800 sm:text-right">
      {value || "Not provided"}
    </span>
  </div>
);

// SIDEBAR SUMMARY ITEM
const SummaryItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-slate-500">{label}</span>

    <span className="break-words font-medium text-slate-800">
      {value}
    </span>
  </div>
);

export default VirtualBookNow;
