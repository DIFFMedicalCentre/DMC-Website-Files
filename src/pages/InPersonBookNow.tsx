import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaHeart,
  FaCheckCircle,
  FaArrowRight,
  FaUser,
  FaClipboardCheck,
  FaCalendarCheck,
  FaShieldAlt,
  FaExclamationTriangle,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Turnstile from "../components/Turnstile";

// DMC consultation times are in WAT (UTC+01:00), not the visitor's time zone.
const watDate = (now = Date.now()) => new Date(now + 3600000).toISOString().slice(0, 10);
const elapsedSlot = (date: string, time: string, now = Date.now()) =>
  Boolean(date && time && Date.parse(`${date}T${time}:00+01:00`) <= now);
const elapsedMessage = "The selected consultation time has elapsed. Kindly select another available time.";

const InPersonBookNow = () => {
  const [clock, setClock] = useState(Date.now);
  useEffect(() => {
    const refresh = () => setClock(Date.now());
    const timer = window.setInterval(refresh, 30000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [submissionError, setSubmissionError] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const submissionLock = useRef(false);
  const attempt = useRef<{ key: string; payload: string } | null>(null);
  const [newPatient, setNewPatient] = useState("");
  const [validationAttempt, setValidationAttempt] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [obgynIvfPath, setObgynIvfPath] = useState<"" | "consultants" | "ivf">("");
  const [selectedConsultant, setSelectedConsultant] = useState("");
  const [selectedSpecialistService, setSelectedSpecialistService] = useState("");
  const [selectedSpecialistDoctor, setSelectedSpecialistDoctor] = useState("");
  const [selectedConsultationDate, setSelectedConsultationDate] = useState("");
  const [visibleCalendarMonth, setVisibleCalendarMonth] = useState(() => {
    const [year, month] = watDate().split("-").map(Number);
    return new Date(year, month - 1, 1);
  });
  const [selectedConsultationTime, setSelectedConsultationTime] = useState("");
  const [publicHolidays, setPublicHolidays] = useState<{ date: string; name: string }[]>([]);
  const [holidaysLoading, setHolidaysLoading] = useState(true);
  const [holidayApiError, setHolidayApiError] = useState("");


  // Registration form state
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  // residentialCity now stores the selected Local Government Area (LGA).
  const [residentialCity, setResidentialCity] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [nigeriaLgas, setNigeriaLgas] = useState<
    { name: string; state: string }[]
  >([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [locationsLoadError, setLocationsLoadError] = useState("");

  const nigeriaStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
    "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
    "Enugu", "Federal Capital Territory (FCT)", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
    "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
    "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  ];

  useEffect(() => {
    let isMounted = true;

    const loadNigeriaLocations = async () => {
      setLocationsLoading(true);
      setLocationsLoadError("");

      try {
        const response = await fetch(
          "https://api.openadmindata.org/api/v1/countries/ng.json"
        );

        if (!response.ok) {
          throw new Error("Could not load Nigerian location data.");
        }

        const payload = await response.json();
        const rawLgas = payload?.data?.lga ?? payload?.data?.data?.lga ?? [];

        const formattedLgas = rawLgas
          .map((item: any) => ({
            name: item.name_en ?? item.name?.en ?? item.name ?? "",
            state:
              item.parent_name_en ??
              item.parent?.name_en ??
              item.parent?.name?.en ??
              "",
          }))
          .filter((item: { name: string; state: string }) => item.name && item.state);

        if (isMounted && formattedLgas.length > 0) {
          setNigeriaLgas(formattedLgas);
        } else if (isMounted) {
          throw new Error("The LGA list was empty or returned in an unexpected format.");
        }
      } catch (error) {
        if (isMounted) {
          setLocationsLoadError(
            "We could not load the LGA list. Please check your internet connection and refresh the page."
          );
        }
      } finally {
        if (isMounted) setLocationsLoading(false);
      }
    };

    loadNigeriaLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Nigerian public holidays for this year and the next year.
  // The API is queried annually so the booking calendar stays current.
  useEffect(() => {
    let isMounted = true;

    const loadNigeriaPublicHolidays = async () => {
      setHolidaysLoading(true);
      setHolidayApiError("");

      try {
        const currentYear = new Date().getFullYear();
        const years = [currentYear, currentYear + 1];
        const responses = await Promise.all(
          years.map((year) =>
            fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/NG`),
          ),
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("The Nigerian public-holiday service could not be reached.");
        }

        const holidayLists = await Promise.all(
          responses.map((response) => response.json()),
        );
        const formatted = holidayLists
          .flat()
          .filter(
            (holiday: any) =>
              holiday?.date &&
              (holiday.global !== false) &&
              (!Array.isArray(holiday.types) || holiday.types.includes("Public")),
          )
          .map((holiday: any) => ({
            date: String(holiday.date),
            name: String(holiday.localName || holiday.name || "Public Holiday"),
          }));

        if (isMounted) setPublicHolidays(formatted);
      } catch (error) {
        if (isMounted) {
          setHolidayApiError(
            "Public holidays could not be loaded. Please verify the selected date with the clinic before confirming.",
          );
        }
      } finally {
        if (isMounted) setHolidaysLoading(false);
      }
    };

    loadNigeriaPublicHolidays();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load the Nigerian public-holiday list for future years as the calendar
  // moves beyond the initially prefetched current/next-year range.
  useEffect(() => {
    const year = visibleCalendarMonth.getFullYear();
    const currentYear = new Date().getFullYear();
    if (year <= currentYear + 1) return;

    let isMounted = true;
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/NG`)
      .then((response) => {
        if (!response.ok) throw new Error("Holiday lookup failed");
        return response.json();
      })
      .then((holidays) => {
        if (!isMounted || !Array.isArray(holidays)) return;
        const additions = holidays
          .filter(
            (holiday: any) =>
              holiday?.date &&
              holiday.global !== false &&
              (!Array.isArray(holiday.types) || holiday.types.includes("Public")),
          )
          .map((holiday: any) => ({
            date: String(holiday.date),
            name: String(holiday.localName || holiday.name || "Public Holiday"),
          }));
        setPublicHolidays((existing) => {
          const merged = new Map(existing.map((holiday) => [holiday.date, holiday]));
          additions.forEach((holiday) => merged.set(holiday.date, holiday));
          return Array.from(merged.values());
        });
      })
      .catch(() => {
        // Keep normal weekly schedule dates usable if the holiday API is down.
      });

    return () => {
      isMounted = false;
    };
  }, [visibleCalendarMonth.getFullYear()]);

  const normalizeLocationName = (value: string) =>
    value
      .toLowerCase()
      .replace(/\(fct\)|\(federal capital territory\)/g, "")
      .replace(/[^a-z0-9]/g, "");

  const selectedStateLgas = nigeriaLgas
    .filter((item) =>
      normalizeLocationName(item.state) === normalizeLocationName(stateOfOrigin) ||
      (normalizeLocationName(stateOfOrigin) === "federalcapitalterritory" &&
        normalizeLocationName(item.state).includes("fct"))
    )
    .map((item) => item.name)
    .filter((name, index, all) => all.indexOf(name) === index)
    .sort((a, b) => a.localeCompare(b));
  const [maritalStatus, setMaritalStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [nextOfKin, setNextOfKin] = useState("");
  const [nextOfKinRelationship, setNextOfKinRelationship] = useState("");
  const [howDidYouHear, setHowDidYouHear] = useState<string[]>([]);

  // Existing patient form state
  const [existingFirstName, setExistingFirstName] = useState("");
  const [existingLastName, setExistingLastName] = useState("");
  const [existingEmail, setExistingEmail] = useState("");
  const [hospitalNumber, setHospitalNumber] = useState("");
  const [existingPhone, setExistingPhone] = useState("");
  const [existingWhatsappPhone, setExistingWhatsappPhone] = useState("");

  const handleHowDidYouHear = (option: string) => {
    setHowDidYouHear((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const whatsappNumber = "2348150871300";

  const whatsappMessage = encodeURIComponent(
    "Hi, My name is ... I would like to book a physical appointment at DIFF Medical Centre.",
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Premium smooth easing
  const smoothEase = [0.22, 1, 0.36, 1] as const;

  // Progress percentage
  const progress = step * 25;

  // Four appointment stages
  const stages = [
    {
      number: 1,
      title: "Patient Details",
      shortTitle: "Details",
      icon: FaUser,
    },
    {
      number: 2,
      title: "Appointment",
      shortTitle: "Appointment",
      icon: FaCalendarCheck,
    },
    {
      number: 3,
      title: "Confirmation",
      shortTitle: "Confirm",
      icon: FaClipboardCheck,
    },
    {
      number: 4,
      title: "Complete",
      shortTitle: "Complete",
      icon: FaCheckCircle,
    },
  ];

  // ============================================================
  // DOCTOR CONSULTATION SCHEDULING
  // Replace these placeholder schedules with DIFF Medical Centre's
  // confirmed consultation days and times.
  // ============================================================
  type ClinicHours = {
    startTime: string;
    endTime: string;
  };

  type DoctorSchedule = {
    days: number[];
    startTime: string;
    endTime: string;
    slotDuration: number;
    weeklyHours?: Partial<Record<number, ClinicHours>>;
    publicHolidayHours?: ClinicHours;
    publicHolidayAppointmentOnly?: boolean;
  };

  const doctorSchedules: Record<string, DoctorSchedule> = {
    "john-idahosa": {
      days: [1, 2, 3, 4, 5],
      startTime: "14:00",
      endTime: "16:00",
      slotDuration: 30,
    },
    "ifedi-okonkwo": {
      days: [1, 2, 3, 4, 5],
      startTime: "11:00",
      endTime: "16:00",
      slotDuration: 30,
    },
    "dauda-deba-barau": {
      days: [1, 2, 3, 4, 5],
      startTime: "11:00",
      endTime: "16:00",
      slotDuration: 30,
    },
    "Paediatrics Department": {
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
    "General Outpatient Department": {
      days: [1, 2, 3, 4, 5],
      startTime: "08:00",
      endTime: "17:00",
      slotDuration: 30,
      publicHolidayAppointmentOnly: true,
    },
    "Dental Surgeon": {
      days: [1, 2, 3, 4, 5, 6],
      startTime: "08:00",
      endTime: "18:00",
      slotDuration: 30,
      weeklyHours: {
        6: { startTime: "10:00", endTime: "15:00" },
      },
      publicHolidayHours: { startTime: "10:00", endTime: "15:00" },
    },
    "Eye Specialist": {
      days: [1, 2, 3, 4, 5, 6],
      startTime: "09:00",
      endTime: "18:00",
      slotDuration: 30,
      weeklyHours: {
        6: { startTime: "11:00", endTime: "16:00" },
      },
      publicHolidayHours: { startTime: "11:00", endTime: "16:00" },
    },
    "Physiotherapist": {
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
    "Renal Specialist": {
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
    "Radiology Specialist": {
      days: [2, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
    "ENT Specialist": {
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
    "General Surgeon": {
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
    "Andrology/Urology Specialist": {
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
    "Anaesthesia Specialist": {
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "15:00",
      slotDuration: 30,
    },
  };

  // Booked slots must ultimately come from your backend/database.
  // The key format is: "doctor-or-consultant-id|YYYY-MM-DD".
  // Any time listed here is automatically shown as unavailable/disabled.
  const bookedSlotsByDoctorAndDate: Record<string, string[]> = {
    // Example:
    // "john-idahosa|2026-11-02": ["09:30", "11:00"],
    // "Dental Surgeon|2026-11-03": ["10:00", "12:30"],
  };

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const activeSchedulingDoctor =
    selectedAppointment === "OBGYN/IVF" && obgynIvfPath === "consultants"
      ? selectedConsultant
      : selectedAppointment === "Paediatrics" ||
          selectedAppointment === "Other Specialist Consultation"
        ? selectedSpecialistDoctor
        : "";

  const activeDoctorSchedule = activeSchedulingDoctor
    ? doctorSchedules[activeSchedulingDoctor]
    : undefined;

  const schedulingDisplayNames: Record<string, string> = {
    "General Outpatient Department": "Sunshine Family & Psychotherapy Clinic",
    "Dental Surgeon": "Pure Snow Dental Clinic",
    "Eye Specialist": "Absolute Vision Eye Clinic",
    "Radiology Specialist": "Stardatt Clinic",
    "Anaesthesia Specialist": "Body Code Aesthetics",
  };

  const activeSchedulingDisplayName =
    schedulingDisplayNames[activeSchedulingDoctor] || activeSchedulingDoctor;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const suffix = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
  };

  const formatDate = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-").map(Number);
    return new Intl.DateTimeFormat("en-NG", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(year, month - 1, day));
  };

  const publicHolidayByDate = new Map(
    publicHolidays.map((holiday) => [holiday.date, holiday.name]),
  );

  const getScheduleForDate = (
    schedule: DoctorSchedule | undefined,
    dateValue: string,
  ): ClinicHours | null => {
    if (!schedule || !dateValue) return null;

    const [year, month, day] = dateValue.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const holiday = publicHolidayByDate.has(dateValue);

    if (holiday && schedule.publicHolidayHours) {
      return schedule.publicHolidayHours;
    }

    if (holiday && schedule.publicHolidayAppointmentOnly) {
      return null;
    }

    if (!schedule.days.includes(date.getDay())) return null;

    return schedule.weeklyHours?.[date.getDay()] ?? {
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    };
  };

  const isAppointmentOnlyPublicHoliday = (
    schedule: DoctorSchedule | undefined,
    dateValue: string,
  ) =>
    Boolean(
      schedule?.publicHolidayAppointmentOnly &&
      publicHolidayByDate.has(dateValue),
    );

  // Calendar availability is calculated for the displayed month, rather than
  // being capped to a rolling 90-day list. This allows long-range navigation
  // while preserving each doctor's weekly schedule rules.

  const generateTimeSlots = (
    startTime: string,
    endTime: string,
    duration: number,
  ) => {
    const toMinutes = (value: string) => {
      const [hours, minutes] = value.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const slots: string[] = [];
    const start = toMinutes(startTime);
    const end = toMinutes(endTime);

    for (let current = start; current + duration <= end; current += duration) {
      const hours = Math.floor(current / 60);
      const minutes = current % 60;
      slots.push(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      );
    }

    return slots;
  };

  // Open-ended month/year calendar. Month navigation is not capped; the
  // year dropdown expands as the user navigates farther into the future.
  const [watYear, watMonth, watDay] = watDate(clock).split("-").map(Number);
  const todayForCalendar = new Date(watYear, watMonth - 1, watDay);
  const firstCalendarMonth = new Date(
    todayForCalendar.getFullYear(),
    todayForCalendar.getMonth(),
    1,
  );
  const calendarMonthStart = new Date(
    visibleCalendarMonth.getFullYear(),
    visibleCalendarMonth.getMonth(),
    1,
  );
  const calendarStartDate = new Date(
    calendarMonthStart.getFullYear(),
    calendarMonthStart.getMonth(),
    1 - calendarMonthStart.getDay(),
  );
  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStartDate);
    date.setDate(calendarStartDate.getDate() + index);
    const value = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const holidayName = publicHolidayByDate.get(value);
    const isTodayOrFuture = value >= watDate(clock);
    const isRegularWorkingDay = Boolean(
      activeDoctorSchedule?.days.includes(date.getDay()),
    );
    const hasHolidayArrangement = Boolean(
      holidayName &&
      (activeDoctorSchedule?.publicHolidayHours ||
        activeDoctorSchedule?.publicHolidayAppointmentOnly),
    );
    const isAvailable =
      isTodayOrFuture && (isRegularWorkingDay || hasHolidayArrangement);

    return {
      value,
      day: date.getDate(),
      inCurrentMonth: date.getMonth() === calendarMonthStart.getMonth(),
      availableDate: isAvailable ? { value, holidayName } : undefined,
    };
  });
  const canGoToPreviousMonth =
    calendarMonthStart.getTime() > firstCalendarMonth.getTime();
  const monthOptions = Array.from({ length: 12 }, (_, month) => ({
    value: String(month),
    label: new Date(2000, month, 1).toLocaleDateString("en-NG", {
      month: "long",
    }),
  }));
  const currentYear = todayForCalendar.getFullYear();
  const yearOptions = Array.from(
    {
      length: Math.max(
        101,
        calendarMonthStart.getFullYear() - currentYear + 21,
      ),
    },
    (_, index) => currentYear + index,
  );

  const selectedDateIsPublicHoliday =
    Boolean(selectedConsultationDate) &&
    publicHolidayByDate.has(selectedConsultationDate);

  const selectedDateNeedsCallAhead = isAppointmentOnlyPublicHoliday(
    activeDoctorSchedule,
    selectedConsultationDate,
  );

  const selectedDateHours = getScheduleForDate(
    activeDoctorSchedule,
    selectedConsultationDate,
  );

  const consultationTimeSlots =
    activeDoctorSchedule && selectedDateHours
      ? generateTimeSlots(
          selectedDateHours.startTime,
          selectedDateHours.endTime,
          activeDoctorSchedule.slotDuration,
        )
      : [];

  const bookedConsultationSlots =
    activeSchedulingDoctor && selectedConsultationDate
      ? bookedSlotsByDoctorAndDate[
          `${activeSchedulingDoctor}|${selectedConsultationDate}`
        ] ?? []
      : [];

  const selectionExpired = selectedConsultationDate !== "" && (
    selectedConsultationDate < watDate(clock) ||
    elapsedSlot(selectedConsultationDate, selectedConsultationTime, clock)
  );

  useEffect(() => {
    // Preserve the exact payload after an ambiguous network failure; do not
    // silently create a second request with a new idempotency key.
    if (step !== 2 || !selectionExpired || submissionLock.current || attempt.current) return;
    if (selectedConsultationDate < watDate()) setSelectedConsultationDate("");
    setSelectedConsultationTime("");
    setSubmissionError(elapsedMessage);
  }, [step, selectionExpired, selectedConsultationDate]);

  const resetConsultationSelection = () => {
    setSelectedConsultationDate("");
    setSelectedConsultationTime("");
  };

  // Email must contain a valid email-style address before continuing.
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  // ============================================================
  // REQUIRED-FIELD VALIDATION
  // Every field marked with * must be completed before Next is
  // enabled. Only the form belonging to the selected patient type
  // is validated.
  // ============================================================
  const invalidRequiredFieldKeys = (() => {
    if (step === 2) {
      const invalid: string[] = [];
      if (!selectedAppointment) invalid.push("appointment-type");
      if (selectedAppointment === "OBGYN/IVF") {
        if (!obgynIvfPath) invalid.push("obgyn-ivf-path");
        if (obgynIvfPath === "consultants" && !selectedConsultant) invalid.push("consultant");
        if (obgynIvfPath === "ivf" && !selectedConsultant) invalid.push("ivf-team-member");
      }
      if (selectedAppointment === "Paediatrics") {
        if (!selectedSpecialistService || !selectedSpecialistDoctor) {
          invalid.push("paediatrics-option");
        }
      }
      if (selectedAppointment === "Other Specialist Consultation") {
        if (!selectedSpecialistService) invalid.push("specialist-service");
        if (!selectedSpecialistDoctor) invalid.push("specialist-doctor");
      }

      const needsDoctorTimeSlot =
        (selectedAppointment === "OBGYN/IVF" &&
          obgynIvfPath === "consultants" &&
          selectedConsultant) ||
        ((selectedAppointment === "Paediatrics" ||
          selectedAppointment === "Other Specialist Consultation") &&
          selectedSpecialistDoctor);

      if (needsDoctorTimeSlot) {
        if (!selectedConsultationDate || selectedConsultationDate < watDate(clock)) invalid.push("consultation-date");
        if (!selectedDateNeedsCallAhead && (!selectedConsultationTime || selectionExpired)) {
          invalid.push("consultation-time");
        }
      }

      return invalid;
    }

    if (step !== 1) return [];

    const invalid: string[] = [];

    if (!newPatient.trim()) invalid.push("new-patient");

    if (newPatient === "Yes") {
      if (!firstName.trim()) invalid.push("first-name");
      if (!lastName.trim()) invalid.push("last-name");
      if (!email.trim() || !isValidEmail(email)) invalid.push("email");
      if (!gender.trim()) invalid.push("gender");
      if (!phone.trim()) invalid.push("phone");
      if (!dateOfBirth.trim()) invalid.push("date-of-birth");
      if (!residentialAddress.trim()) invalid.push("residential-address");
      if (!residentialCity.trim()) invalid.push("residential-city");
      if (!maritalStatus.trim()) invalid.push("marital-status");
      if (!nationality.trim()) invalid.push("nationality");
      if (!stateOfOrigin.trim()) invalid.push("state-of-origin");
      if (!nextOfKin.trim()) invalid.push("next-of-kin");
      if (!nextOfKinRelationship.trim())
        invalid.push("next-of-kin-relationship");
      if (howDidYouHear.length === 0) invalid.push("how-did-you-hear");
    }

    if (newPatient === "No") {
      if (!existingFirstName.trim()) invalid.push("existing-first-name");
      if (!existingLastName.trim()) invalid.push("existing-last-name");
      if (!existingEmail.trim() || !isValidEmail(existingEmail)) {
        invalid.push("existing-email");
      }
      if (!existingPhone.trim()) invalid.push("existing-phone");
    }

    return invalid;
  })();

  const canContinue = invalidRequiredFieldKeys.length === 0;

  // IVF appointments are scheduled directly by the IVF Administrators.
  // Hide the standard Next button only while this pathway is selected.
  const isIvfAdministratorScheduling =
    step === 2 &&
    selectedAppointment === "OBGYN/IVF" &&
    obgynIvfPath === "ivf";

  // Animated inline validation message for an individual required field.
  // Errors are shown only after the user attempts to continue.
  const RequiredFieldError = ({
    show,
    fieldKey,
    message = "This field is required",
  }: {
    show: boolean;
    fieldKey: string;
    message?: string;
  }) => {
    if (!show) return null;

    return (
      <motion.p
        key={`${fieldKey}-${validationAttempt}`}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: [0, -7, 7, -5, 5, 0] }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        data-validation-error="true"
        className="mt-2 scroll-mt-32 text-xs font-bold text-red-600"
      >
        {message}
      </motion.p>
    );
  };

  // Next button
  const handleNext = async () => {
    if (submissionLock.current) return;
    if (step === 3) {
      if (!attempt.current && (selectedConsultationDate < watDate() ||
          elapsedSlot(selectedConsultationDate, selectedConsultationTime))) {
        setSubmissionError(elapsedMessage);
        setSelectedConsultationTime("");
        if (selectedConsultationDate < watDate()) setSelectedConsultationDate("");
        setTurnstileToken("");
        setTurnstileResetKey((current) => current + 1);
        setStep(2);
        return;
      }
      if (!turnstileToken) {
        setSubmissionError("Please complete the security verification.");
        return;
      }
      submissionLock.current = true;
      setSubmitting(true);
      setSubmissionError("");
      try {
        const isNew = newPatient === "Yes";
        const payload = {
          patientType: isNew ? "new" : "existing",
          firstName: isNew ? firstName : existingFirstName,
          lastName: isNew ? lastName : existingLastName,
          email: isNew ? email : existingEmail,
          phone: isNew ? phone : existingPhone,
          whatsappPhone: isNew ? whatsappPhone : existingWhatsappPhone,
          ...(isNew ? { middleName, gender, dateOfBirth, residentialAddress,
            residentialCity, stateOfOrigin, maritalStatus, nationality,
            nextOfKin, nextOfKinRelationship, howDidYouHear } : { hospitalNumber }),
          appointmentType: selectedAppointment,
          obgynIvfPath, consultantId: selectedConsultant,
          specialistService: selectedSpecialistService,
          specialistDoctor: selectedSpecialistDoctor,
          requestedDate: selectedConsultationDate,
          requestedTime: selectedConsultationTime,
          callAhead: selectedDateNeedsCallAhead,
        };
        const hadPreviousAttempt = Boolean(attempt.current);
        const serialized = JSON.stringify(payload);
        if (!attempt.current || attempt.current.payload !== serialized) {
          attempt.current = { key: crypto.randomUUID(), payload: serialized };
        }
        const response = await fetch("/.netlify/functions/create-appointment", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, idempotencyKey: attempt.current.key, turnstileToken }),
          signal: AbortSignal.timeout(25000),
        });
        const result = await response.json();
        if (!response.ok || !result.success || !result.bookingReference) {
          if (response.status === 400 && result.message !== elapsedMessage && result.message !== "Please select a current or future consultation date.") attempt.current = null;
          if (response.status === 400 && (result.message === elapsedMessage || result.message === "Please select a current or future consultation date.")) {
            // A first definitive rejection is safe to edit; an earlier uncertain
            // attempt may already have saved the same request.
            if (!hadPreviousAttempt) {
              attempt.current = null;
              setSelectedConsultationTime("");
              if (selectedConsultationDate < watDate()) setSelectedConsultationDate("");
              setStep(2);
            } else {
              throw new Error("The selected time has elapsed and an earlier submission may already have been saved. Please contact DMC to verify before making another request.");
            }
          }
          throw new Error(result.message || "Unable to verify submission. Please retry.");
        }
        setBookingReference(result.bookingReference);
        setEmailStatus(result.patientEmail);
        setStep(4);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        setSubmissionError(error instanceof Error && error.name === "Error" ? error.message : "Unable to verify submission. Please retry without refreshing the page.");
      } finally {
        setTurnstileToken("");
        setTurnstileResetKey((current) => current + 1);
        submissionLock.current = false;
        setSubmitting(false);
      }
      return;
    }
    if (step >= 4) return;

    if (step === 2 && (selectedConsultationDate && selectedConsultationDate < watDate() ||
        elapsedSlot(selectedConsultationDate, selectedConsultationTime))) {
      setClock(Date.now());
      setSubmissionError(elapsedMessage);
      return;
    }
    if (!canContinue) {
      // Validation messages are intentionally triggered only by clicking Next.
      // Incrementing the attempt also replays the bounce if Next is clicked again
      // while required fields are still empty.
      setValidationAttempt((current) => current + 1);

      // Wait for the validation message to render, then smoothly scroll to
      // the first invalid required field in the same order it appears on the page.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const firstInvalid = document.querySelector<HTMLElement>(
            '[data-validation-error="true"]',
          );

          firstInvalid?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        });
      });

      return;
    }

    setValidationAttempt(0);
    setStep((prev) => prev + 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Back button
  const handleBack = () => {
    if (step <= 1 || submissionLock.current || (step === 3 && attempt.current)) return;

    setTurnstileToken("");
    setTurnstileResetKey((current) => current + 1);

    setValidationAttempt(0);
    setStep((prev) => prev - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f9fc] text-slate-800">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <div className="fixed left-0 right-0 top-0 z-[9999]">
        <Navbar />
      </div>

      {/* =========================================================
          MAIN PAGE
      ========================================================= */}
      <main className="relative min-h-screen overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-10">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-200/20 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          {/* =====================================================
              PAGE HEADING
          ===================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: smoothEase,
            }}
            className="mb-8"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-[#092957] sm:text-5xl lg:text-6xl">
              Book Physical Appointments
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
              Begin your appointment journey with our healthcare team.
            </p>
          </motion.div>

          {/* =====================================================
              PROGRESS SECTION — simple bar matching the reference
          ===================================================== */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: smoothEase }}
            className="mb-6 mx-auto w-full max-w-3xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-700">
                Step {step} of 4
              </p>
              <span className="text-xs font-semibold text-slate-600">
                {progress}%
              </span>
            </div>

            <div
              className="h-3 w-full overflow-hidden rounded-sm bg-slate-200"
              role="progressbar"
              aria-label="Appointment progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: smoothEase }}
                className="flex h-full items-center justify-end bg-blue-600 pr-1.5"
              >
                <span className="text-[9px] font-bold leading-none text-white">
                  {progress}%
                </span>
              </motion.div>
            </div>

            {/* Four-stage appointment progress pattern */}
            <div className="mt-4 grid grid-cols-4 gap-2">
              {stages.map((stage) => {
                const Icon = stage.icon;
                const active = stage.number <= step;

                return (
                  <div
                    key={stage.number}
                    className={`flex min-w-0 flex-col items-center gap-2 text-center text-[10px] font-semibold transition-colors duration-300 sm:flex-row sm:justify-center sm:text-xs ${
                      active ? "text-[#092957]" : "text-slate-400"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        active
                          ? "bg-cyan-600 text-white"
                          : "border border-slate-300 bg-white text-slate-400"
                      }`}
                    >
                      {stage.number < step ? (
                        <FaCheckCircle className="text-xs" />
                      ) : (
                        <Icon className="text-[10px]" />
                      )}
                    </span>
                    <span>{stage.title}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* =====================================================
              MAIN APPOINTMENT CARD
          ===================================================== */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.2,
              duration: 0.7,
              ease: smoothEase,
            }}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_70px_rgba(20,55,75,0.08)]"
          >
            {/* =================================================
                EMERGENCY NOTICE
            ================================================= */}
            <div className="p-4 sm:p-6">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.98,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.55,
                  ease: smoothEase,
                }}
                className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#5961d9] to-[#78a5ef] p-5 text-center text-white shadow-lg sm:p-7"
              >
                {/* Emergency title */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <motion.div
                    animate={{
                      scale: [1, 1.08, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="shrink-0 text-yellow-300"
                  >
                    <FaExclamationTriangle />
                  </motion.div>

                  <h2 className="text-lg font-extrabold sm:text-2xl">
                    Important Notice for Online Bookings & Emergencies
                  </h2>
                </div>

                {/* Emergency description */}
                <p className="mx-auto mt-3 max-w-3xl text-sm italic leading-6 text-white/90">
                  For Emergencies and Rapid Response(s), please refer to this
                  contact number below:
                </p>

                {/* Emergency phone */}
                <a
                  href="tel:+23470030304040"
                  className="mx-auto mt-5 flex min-h-[55px] max-w-3xl items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-medium text-slate-600 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:text-sm"
                >
                  <FaPhoneAlt className="shrink-0 text-[#092957]" />

                  <span>
                    <strong>Emergency:</strong> Call{" "}
                    <strong className="text-[#092957]">
                      +234 700 303 04040
                    </strong>{" "}
                    for assistance.
                  </span>
                </a>
              </motion.div>
            </div>

            {/* =================================================
                FORM CONTENT
            ================================================= */}
            <div className="px-5 pb-6 sm:px-8 lg:px-10">
              <AnimatePresence mode="wait">
                {/* =================================================
                    STEP 1 - PATIENT INFORMATION
                ================================================= */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -15,
                    }}
                    transition={{
                      duration: 0.45,
                      ease: smoothEase,
                    }}
                  >
                    {/* Step heading */}
                    <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                        <FaUser />
                      </div>

                      <div>
                        <h2 className="text-xl font-extrabold text-[#123f4e]">
                          Patient Information
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Please provide the information below to continue.
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                        NEW PATIENT
                    ================================================= */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.1,
                        duration: 0.45,
                      }}
                      className="mb-8"
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-800 sm:text-base">
                          Are you a new patient?
                          <span className="ml-1 text-red-500">*</span>
                        </h3>
                      </div>

                      <RequiredFieldError
                        fieldKey="new-patient"
                        show={validationAttempt > 0 && !newPatient.trim()}
                      />

                      <div className="grid max-w-md grid-cols-2 gap-3">
                        {["Yes", "No"].map((option) => {
                          const selected = newPatient === option;

                          return (
                            <motion.button
                              key={option}
                              type="button"
                              onClick={() => {
                                setNewPatient(option);
                                setValidationAttempt(0);
                              }}
                              whileHover={{
                                y: -2,
                              }}
                              whileTap={{
                                scale: 0.98,
                              }}
                              className={`relative flex min-h-[54px] items-center justify-center rounded-xl border px-5 text-sm font-semibold transition-all duration-300 ${
                                selected
                                  ? "border-cyan-500 bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/50"
                              }`}
                            >
                              {option}

                              {selected && (
                                <motion.span
                                  initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                  }}
                                  transition={{
                                    duration: 0.25,
                                  }}
                                  className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-cyan-600"
                                >
                                  <FaCheckCircle className="text-xs" />
                                </motion.span>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>

                    {/* =================================================
                        NEW PATIENT REGISTRATION FORM

                        THIS FORM ONLY APPEARS WHEN "YES" IS SELECTED.

                        Animation:
                        bottom -> top
                        stops immediately in its final position.
                    ================================================= */}
                    <AnimatePresence initial={false}>
                      {newPatient === "Yes" && (
                        <motion.div
                          key="registration-form"
                          initial={{
                            opacity: 0,
                            y: 120,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            y: 60,
                          }}
                          transition={{
                            duration: 0.75,
                            ease: smoothEase,
                          }}
                          className="overflow-hidden"
                        >
                          {/* =================================================
                              FORM HEADER
                          ================================================= */}
                          <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-50 px-4 py-4 sm:px-6">
                            <h2 className="text-lg font-extrabold text-[#123f4e] sm:text-2xl">
                              Kindly fill the form below:
                            </h2>
                          </div>

                          {/* =================================================
                              FORM FIELDS
                          ================================================= */}
                          <div className="space-y-5">
                            {/* First / Middle / Last Name */}
                            <div className="grid gap-5 md:grid-cols-3">
                              <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                  First Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>

                                <input
                                  type="text"
                                  required
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  placeholder="First Name"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                                <RequiredFieldError
                                  fieldKey="first-name"
                                  show={
                                    validationAttempt > 0 && !firstName.trim()
                                  }
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                  Middle Name
                                </label>

                                <input
                                  type="text"
                                  value={middleName}
                                  onChange={(e) =>
                                    setMiddleName(e.target.value)
                                  }
                                  placeholder="Middle Name"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                  Last Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>

                                <input
                                  type="text"
                                  required
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  placeholder="Last Name"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                                <RequiredFieldError
                                  fieldKey="last-name"
                                  show={
                                    validationAttempt > 0 && !lastName.trim()
                                  }
                                />
                              </div>
                            </div>

                            {/* Email */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Email <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                              <RequiredFieldError
                                fieldKey="email"
                                show={
                                  validationAttempt > 0 &&
                                  (!email.trim() || !isValidEmail(email))
                                }
                                message={
                                  email.trim()
                                    ? "Enter a valid email address"
                                    : "This field is required"
                                }
                              />
                            </div>

                            {/* Gender */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Gender <span className="text-red-500">*</span>
                              </label>

                              <select
                                required
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                              <RequiredFieldError
                                fieldKey="gender"
                                show={validationAttempt > 0 && !gender.trim()}
                              />
                            </div>

                            {/* Phone */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Phone/Mobile{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                value={phone}
                                onChange={(e) =>
                                  setPhone(e.target.value.replace(/\D/g, ""))
                                }
                                placeholder="Phone / Mobile Number"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                              <RequiredFieldError
                                fieldKey="phone"
                                show={validationAttempt > 0 && !phone.trim()}
                              />
                            </div>

                            {/* WhatsApp Number - Optional */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                WhatsApp Number{" "}
                                <span className="font-medium text-slate-400">(Optional)</span>
                              </label>
                              <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={whatsappPhone}
                                onChange={(e) =>
                                  setWhatsappPhone(e.target.value.replace(/\D/g, ""))
                                }
                                placeholder="WhatsApp Number"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                            </div>

                            {/* Date of Birth */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Date of birth{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="date"
                                required
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                              <RequiredFieldError
                                fieldKey="date-of-birth"
                                show={
                                  validationAttempt > 0 && !dateOfBirth.trim()
                                }
                              />
                            </div>

                            {/* Contact Address */}
                            <div className="grid gap-5">
                              <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                  Contact Address{" "}
                                  <span className="text-red-500">*</span>
                                </label>

                                <input
                                  type="text"
                                  required
                                  value={residentialAddress}
                                  onChange={(e) =>
                                    setResidentialAddress(e.target.value)
                                  }
                                  placeholder="Contact Address"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                                <RequiredFieldError
                                  fieldKey="residential-address"
                                  show={
                                    validationAttempt > 0 &&
                                    !residentialAddress.trim()
                                  }
                                />
                              </div>

                            </div>

                            {/* Marital Status */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Marital Status{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <select
                                required
                                value={maritalStatus}
                                onChange={(e) =>
                                  setMaritalStatus(e.target.value)
                                }
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              >
                                <option value="">Select Marital Status</option>

                                <option value="Single">Single</option>

                                <option value="Married">Married</option>

                                <option value="Divorced">Divorced</option>

                                <option value="Widowed">Widowed</option>
                              </select>
                              <RequiredFieldError
                                fieldKey="marital-status"
                                show={
                                  validationAttempt > 0 && !maritalStatus.trim()
                                }
                              />
                            </div>

                            {/* Nationality */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Nationality{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <select
                                required
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              >
                                <option value="">Select Nationality</option>

                                <option value="Nigeria">Nigeria</option>

                                <option value="Ghana">Ghana</option>

                                <option value="United Kingdom">
                                  United Kingdom
                                </option>

                                <option value="United States">
                                  United States
                                </option>

                                <option value="Canada">Canada</option>

                                <option value="Other">Other</option>
                              </select>
                              <RequiredFieldError
                                fieldKey="nationality"
                                show={
                                  validationAttempt > 0 && !nationality.trim()
                                }
                              />
                            </div>

                            {/* State of Origin */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                State of Origin{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <select
                                required
                                value={stateOfOrigin}
                                onChange={(e) => {
                                  setStateOfOrigin(e.target.value);
                                  setResidentialCity("");
                                }}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              >
                                <option value="">Select State of Origin</option>
                                {nigeriaStates.map((state) => (
                                  <option key={state} value={state}>
                                    {state}
                                  </option>
                                ))}
                              </select>
                              <RequiredFieldError
                                fieldKey="state-of-origin"
                                show={
                                  validationAttempt > 0 && !stateOfOrigin.trim()
                                }
                              />
                            </div>

                            {/* Local Government Area (LGA) */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Local Government Area (LGA) {" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                required
                                value={residentialCity}
                                disabled={!stateOfOrigin || locationsLoading || selectedStateLgas.length === 0}
                                onChange={(e) => setResidentialCity(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                              >
                                <option value="" className="text-gray-300">
                                  {!stateOfOrigin
                                    ? "Select a state first"
                                    : locationsLoading
                                    ? "Loading local governments..."
                                    : selectedStateLgas.length > 0
                                    ? "Select Local Government Area"
                                    : "No LGA list available"}
                                </option>
                                {selectedStateLgas.map((lga) => (
                                  <option key={lga} value={lga}>
                                    {lga}
                                  </option>
                                ))}
                              </select>
                              {locationsLoadError && (
                                <p className="mt-2 text-xs text-amber-700">
                                  {locationsLoadError}
                                </p>
                              )}
                              <RequiredFieldError
                                fieldKey="residential-city"
                                show={validationAttempt > 0 && !residentialCity.trim()}
                              />
                            </div>

                            {/* Next of Kin */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Next Of Kin{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="text"
                                required
                                value={nextOfKin}
                                onChange={(e) => setNextOfKin(e.target.value)}
                                placeholder="Full Name of Next of Kin"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                              <RequiredFieldError
                                fieldKey="next-of-kin"
                                show={
                                  validationAttempt > 0 && !nextOfKin.trim()
                                }
                              />
                            </div>

                            {/* Relationship */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                What's your relationship with your next of kin?{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <input
                                type="text"
                                required
                                value={nextOfKinRelationship}
                                onChange={(e) =>
                                  setNextOfKinRelationship(e.target.value)
                                }
                                placeholder="Relationship with Next of Kin"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                              <RequiredFieldError
                                fieldKey="next-of-kin-relationship"
                                show={
                                  validationAttempt > 0 &&
                                  !nextOfKinRelationship.trim()
                                }
                              />
                            </div>

                            {/* =================================================
                                HOW DID YOU HEAR ABOUT US?
                            ================================================= */}
                            <div className="pb-4">
                              <label className="mb-4 block text-sm font-bold text-slate-700">
                                How did you hear about us?{" "}
                                <span className="text-red-500">*</span>
                              </label>

                              <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                  "Social Media",
                                  "Family and Friends",
                                  "Employer",
                                  "Doctors Referral",
                                  "Others",
                                ].map((option) => {
                                  const checked =
                                    howDidYouHear.includes(option);

                                  return (
                                    <label
                                      key={option}
                                      className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                                        checked
                                          ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                                          : "border-slate-200 bg-white text-slate-600 hover:border-cyan-300"
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                          handleHowDidYouHear(option)
                                        }
                                        className="h-4 w-4 accent-cyan-600"
                                      />

                                      {option}
                                    </label>
                                  );
                                })}
                              </div>

                              <RequiredFieldError
                                fieldKey="how-did-you-hear"
                                show={
                                  validationAttempt > 0 &&
                                  howDidYouHear.length === 0
                                }
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* =================================================
                        EXISTING PATIENT FORM

                        Appears when "No" is selected and uses the same
                        bottom -> top animation as the new-patient form.
                    ================================================= */}
                    <AnimatePresence initial={false}>
                      {newPatient === "No" && (
                        <motion.div
                          key="existing-patient-form"
                          initial={{ opacity: 0, y: 120 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 60 }}
                          transition={{ duration: 0.75, ease: smoothEase }}
                          className="overflow-hidden"
                        >
                          <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-50 px-4 py-4 sm:px-6">
                            <h2 className="text-lg font-extrabold text-[#123f4e] sm:text-2xl">
                              Please let us know your patient details:
                            </h2>
                          </div>

                          <div className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                  First Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={existingFirstName}
                                  onChange={(e) =>
                                    setExistingFirstName(e.target.value)
                                  }
                                  placeholder="Enter Your First Name"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                                <RequiredFieldError
                                  fieldKey="existing-first-name"
                                  show={
                                    validationAttempt > 0 &&
                                    !existingFirstName.trim()
                                  }
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                  Last Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={existingLastName}
                                  onChange={(e) =>
                                    setExistingLastName(e.target.value)
                                  }
                                  placeholder="Enter Your Last Name"
                                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                                />
                                <RequiredFieldError
                                  fieldKey="existing-last-name"
                                  show={
                                    validationAttempt > 0 &&
                                    !existingLastName.trim()
                                  }
                                />
                              </div>
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Email <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                inputMode="email"
                                autoComplete="email"
                                pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                                required
                                value={existingEmail}
                                onChange={(e) =>
                                  setExistingEmail(e.target.value)
                                }
                                placeholder="Email Address"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                              <RequiredFieldError
                                fieldKey="existing-email"
                                show={
                                  validationAttempt > 0 &&
                                  (!existingEmail.trim() ||
                                    !isValidEmail(existingEmail))
                                }
                                message={
                                  existingEmail.trim()
                                    ? "Enter a valid email address"
                                    : "This field is required"
                                }
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Your hospital number
                              </label>
                              <input
                                type="text"
                                value={hospitalNumber}
                                onChange={(e) =>
                                  setHospitalNumber(e.target.value)
                                }
                                placeholder="Hospital Number"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                Phone/Mobile{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                required
                                value={existingPhone}
                                onChange={(e) =>
                                  setExistingPhone(
                                    e.target.value.replace(/\D/g, ""),
                                  )
                                }
                                placeholder="Mobile Number"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                              <RequiredFieldError
                                fieldKey="existing-phone"
                                show={
                                  validationAttempt > 0 && !existingPhone.trim()
                                }
                              />
                            </div>

                            {/* WhatsApp Number - Optional */}
                            <div>
                              <label className="mb-2 block text-sm font-bold text-slate-700">
                                WhatsApp Number{" "}
                                <span className="font-medium text-slate-400">(Optional)</span>
                              </label>
                              <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={existingWhatsappPhone}
                                onChange={(e) =>
                                  setExistingWhatsappPhone(
                                    e.target.value.replace(/\D/g, ""),
                                  )
                                }
                                placeholder="WhatsApp Number"
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 2 - APPOINTMENT TYPE
                ================================================= */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.45, ease: smoothEase }}
                    className="py-6 sm:py-8"
                  >
                    <div className="mx-auto max-w-5xl">
                      <h2 className="mb-5 text-base font-bold text-slate-900 sm:text-lg">
                        Choose Your Appointment Type:<span className="ml-1 text-red-500">*</span>
                      </h2>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                          { title: "OBGYN/IVF", image: "/obygynivf.jpg", description: "Obstetrics, gynaecology and fertility care" },
                          { title: "Paediatrics", image: "/paediatrics.jpg", description: "Paediatric outpatient consultation" },
                          { title: "Other Specialist Consultation", image: "/other-specialist.jpg", description: "Choose a service and its specialist" },
                        ].map((appointment) => {
                          const selected = selectedAppointment === appointment.title;
                          return (
                            <motion.button key={appointment.title} type="button" aria-pressed={selected}
                              onClick={() => {
                                setSelectedAppointment(appointment.title);
                                setValidationAttempt(0);
                                setObgynIvfPath("");
                                setSelectedConsultant("");
                                setSelectedSpecialistService("");
                                setSelectedSpecialistDoctor("");
                                resetConsultationSelection();
                              }}
                              whileHover={{ y: -3 }} whileTap={{ scale: 0.99 }}
                              className={`overflow-hidden rounded-xl border text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${selected ? "border-blue-500 ring-2 ring-blue-200 shadow-lg" : "border-slate-200 hover:border-blue-300 hover:shadow-md"}`}>
                              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                                <img src={appointment.image} alt={appointment.title} className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                              </div>
                              <div className={`min-h-[70px] px-4 py-3 ${selected ? "bg-blue-50" : "bg-white"}`}>
                                <p className="text-sm font-bold text-slate-800">{appointment.title}</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">{appointment.description}</p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                      <RequiredFieldError fieldKey="appointment-type" show={validationAttempt > 0 && !selectedAppointment} message="Please choose an appointment type to continue." />

                      <AnimatePresence mode="wait">
                        {selectedAppointment === "OBGYN/IVF" && (
                          <motion.section key="obgyn-ivf-options" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
                            <h3 className="text-lg font-extrabold text-[#092957]">OBGYN / IVF</h3>
                            <p className="mt-1 text-sm text-slate-500">Choose the team you would like to consult.</p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              {[{ value: "consultants", title: "OBGYN - Consultants", desc: "Book with an obstetrics and gynaecology consultant" }, { value: "ivf", title: "IVF Team", desc: "Meet our fertility care team" }].map((option) => (
                                <button key={option.value} type="button" onClick={() => { setObgynIvfPath(option.value as "consultants" | "ivf"); setSelectedConsultant(""); resetConsultationSelection(); setValidationAttempt(0); }} className={`rounded-xl border p-4 text-left transition-all ${obgynIvfPath === option.value ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100" : "border-slate-200 bg-white hover:border-cyan-300"}`}>
                                  <span className="block font-bold text-slate-800">{option.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{option.desc}</span>
                                </button>
                              ))}
                            </div>
                            <RequiredFieldError fieldKey="obgyn-ivf-path" show={validationAttempt > 0 && !obgynIvfPath} message="Please select OBGYN - Consultants or IVF Team." />

                            {obgynIvfPath === "consultants" && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                                <h4 className="mb-3 font-bold text-slate-800">Available OBGYN Consultants</h4>
                                <p className="mb-4 text-xs leading-5 text-slate-500">Select a consultant and preferred working session. Replace the sample entries below with DIFF Medical Centre’s confirmed consultant roster and clinic hours.</p>
                                <div className="grid gap-3 md:grid-cols-2">
                                  {[{ id: "john-idahosa", name: "Dr. John Idahosa", hours: "Monday to Friday • 2:00 PM – 4:00 PM" }, { id: "ifedi-okonkwo", name: "Dr. Ifedi Okonkwo", hours: "Monday to Friday • 11:00 AM – 4:00 PM" }, { id: "dauda-deba-barau", name: "Dr. Dauda Deba Barau", hours: "Monday to Friday • 11:00 AM – 4:00 PM" }].map((person, index) => (
                                    <button key={person.id} type="button" onClick={() => { setSelectedConsultant(person.id); resetConsultationSelection(); setValidationAttempt(0); }} className={`flex items-start gap-3 rounded-xl border bg-white p-4 text-left transition-all ${selectedConsultant === person.id ? "border-cyan-500 ring-2 ring-cyan-100" : "border-slate-200 hover:border-cyan-300"}`}>
                                      <img src={["https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&h=160&q=80", "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&h=160&q=80", "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&h=160&q=80"][index]} alt={`Tentative portrait for ${person.name}`} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm" /><span className="min-w-0 flex-1"><span className="block font-bold text-slate-800">{person.name}</span><span className="mt-1 block text-xs text-slate-500">{person.hours}</span></span><span className={`mt-1 h-4 w-4 rounded-full border ${selectedConsultant === person.id ? "border-cyan-600 bg-cyan-600 ring-2 ring-cyan-100" : "border-slate-300"}`} />
                                    </button>
                                  ))}
                                </div>
                                <RequiredFieldError fieldKey="consultant" show={validationAttempt > 0 && !selectedConsultant} message="Please select an OBGYN consultant." />
                              </motion.div>
                            )}

                            {obgynIvfPath === "ivf" && (
                              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                                <h4 className="mb-3 font-bold text-slate-800">Meet the IVF Team</h4>
                                <p className="mb-4 text-xs text-slate-500">Choose a team member to indicate your preferred contact.</p>
                                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                  {[{ id: "adesuwa-evans-ogbebor", name: "Dr. Adesuwa Evans-Ogbebor", role: "Embryologist Laboratory Director" }, { id: "godspower-omogiade", name: "Godspower Omogiade", role: "Deputy Head, IVF Unit" }, { id: "damilola-akinmoluwayan", name: "Damilola Akinmoluwayan", role: "Head, IVF Nursing Unit" }].map((person, index) => (
                                    <button key={person.id} type="button" onClick={() => setSelectedConsultant(person.id)} className={`rounded-xl border bg-white p-4 text-left transition-all ${selectedConsultant === person.id ? "border-cyan-500 ring-2 ring-cyan-100" : "border-slate-200 hover:border-cyan-300"}`}>
                                      <img src={["https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=180&h=180&q=80", "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=180&h=180&q=80", "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=180&h=180&q=80"][index]} alt={`Tentative portrait for ${person.name}`} className="mb-3 h-16 w-16 rounded-full object-cover ring-2 ring-purple-100 shadow-sm" /><span className="block font-bold text-slate-800">{person.name}</span><span className="mt-1 block text-xs text-slate-500">{person.role}</span>
                                    </button>
                                  ))}
                                </div>
                                <AnimatePresence mode="wait">
                                  <motion.div
                                    key="ivf-admin-scheduling-notice"
                                    initial={{ opacity: 0, y: 14, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{ duration: 0.4, ease: smoothEase }}
                                    role="status"
                                    aria-live="polite"
                                    className="mt-5 rounded-xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-white to-blue-50 p-4 text-cyan-950 shadow-sm sm:p-5"
                                  >
                                    <div className="flex items-start gap-3">
                                      <motion.span
                                        animate={{ scale: [1, 1.12, 1] }}
                                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                                        className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-lg text-cyan-700"
                                      >
                                        <FaWhatsapp />
                                      </motion.span>
                                      <div className="min-w-0 flex-1">
                                        <motion.p
                                          animate={{ opacity: [0.8, 1, 0.8] }}
                                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                          className="font-extrabold leading-6"
                                        >
                                          Only the IVF Administrators can schedule an appointment for you.
                                        </motion.p>
                                        <p className="mt-1 text-sm leading-6 text-cyan-800">
                                          Please contact the IVF Administrators for proper scheduling and guidance.
                                        </p>
                                        <a
                                          href={whatsappLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#092957] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-cyan-700"
                                        >
                                          Request a link-up
                                          <FaArrowRight />
                                        </a>
                                      </div>
                                    </div>
                                  </motion.div>
                                </AnimatePresence>
                              </motion.div>
                            )}
                          </motion.section>
                        )}

                        {selectedAppointment === "Paediatrics" && (
                          <motion.section
                            key="paediatrics-options"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6"
                          >
                            <h3 className="text-lg font-extrabold text-[#092957]">
                              Paediatrics Consultation
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                              Select the type of paediatric appointment you need.
                            </p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              {[
                                {
                                  service: "General Paediatric Consultation",
                                  doctor: "Paediatrics Department",
                                  description: "For general child health concerns and assessment",
                                },
                                {
                                  service: "Paediatric Follow-up",
                                  doctor: "Paediatrics Department",
                                  description: "For a review following a previous consultation",
                                },
                              ].map((option) => (
                                <button
                                  key={option.service}
                                  type="button"
                                  aria-pressed={selectedSpecialistService === option.service}
                                  onClick={() => {
                                    setSelectedSpecialistService(option.service);
                                    setSelectedSpecialistDoctor(option.doctor);
                                    resetConsultationSelection();
                                    setValidationAttempt(0);
                                  }}
                                  className={`rounded-xl border p-4 text-left transition-all ${
                                    selectedSpecialistService === option.service
                                      ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100"
                                      : "border-slate-200 bg-white hover:border-cyan-300"
                                  }`}
                                >
                                  <span className="block font-bold text-slate-800">
                                    {option.service}
                                  </span>
                                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                                    {option.description}
                                  </span>
                                </button>
                              ))}
                            </div>
                            <RequiredFieldError
                              fieldKey="paediatrics-option"
                              show={
                                validationAttempt > 0 &&
                                (!selectedSpecialistService || !selectedSpecialistDoctor)
                              }
                              message="Please select a paediatric appointment option."
                            />
                          </motion.section>
                        )}

                        {selectedAppointment === "Other Specialist Consultation" && (
                          <motion.section key="other-specialists" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
                            <h3 className="text-lg font-extrabold text-[#092957]">Specialist Services</h3>
                            <p className="mt-1 text-sm text-slate-500">Choose a service to see its assigned specialist(s).</p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                              {[{ service: "Sunshine Family & Psychotherapy Clinic", doctor: "General Outpatient Department", caption: "Cognitive Behavioural Therapy", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "Pure Snow Dental Clinic", doctor: "Dental Surgeon", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "Absolute Vision Eye Clinic", doctor: "Eye Specialist", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "Physiotherapy & Rehabilitation", doctor: "Physiotherapist", photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "Renal / Nephrology", doctor: "Renal Specialist", photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "Stardatt Clinic", doctor: "Radiology Specialist", photo: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "E.N.T. Clinic", doctor: "ENT Specialist", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "General Surgery", doctor: "General Surgeon", photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "Andrology/Urology", doctor: "Andrology/Urology Specialist", photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&h=160&q=80" }, { service: "Body Code Aesthetics", doctor: "Anaesthesia Specialist", caption: "Cosmetic Surgery", photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=160&h=160&q=80" }].map((item) => (
                                <button key={item.service} type="button" onClick={() => { setSelectedSpecialistService(item.service); setSelectedSpecialistDoctor(item.doctor); resetConsultationSelection(); setValidationAttempt(0); }} className={`flex items-center justify-between gap-3 rounded-xl border bg-white p-4 text-left transition-all ${selectedSpecialistService === item.service ? "border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100" : "border-slate-200 hover:border-cyan-300"}`}>
                                  <span className="flex min-w-0 items-center gap-3"><img src={item.photo} alt={`Tentative portrait for ${item.doctor}`} className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm" /><span><span className="block font-bold text-slate-800">{item.service}</span><span className="mt-1 block text-xs text-slate-500">{item.caption || item.doctor}</span></span></span><span className={`h-4 w-4 shrink-0 rounded-full border ${selectedSpecialistService === item.service ? "border-cyan-600 bg-cyan-600 ring-2 ring-cyan-100" : "border-slate-300"}`} />
                                </button>
                              ))}
                            </div>
                            <RequiredFieldError fieldKey="specialist-service" show={validationAttempt > 0 && !selectedSpecialistService} message="Please select a specialist service." />
                            {selectedSpecialistService && (
                              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl border border-cyan-100 bg-white p-4">
                                <div className="flex items-center gap-3"><img src={({ "Paediatrics": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&h=160&q=80", "Pure Snow Dental Clinic": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&h=160&q=80", "Absolute Vision Eye Clinic": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&h=160&q=80", "Physiotherapy & Rehabilitation": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=160&h=160&q=80", "Renal / Nephrology": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=160&h=160&q=80", "Stardatt Clinic": "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=160&h=160&q=80", "E.N.T. Clinic": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=160&h=160&q=80", "General Surgery": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=160&h=160&q=80", "Andrology/Urology": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=160&h=160&q=80", "Body Code Aesthetics": "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=160&h=160&q=80" } as Record<string, string>)[selectedSpecialistService]} alt={`Tentative portrait for ${selectedSpecialistDoctor}`} className="h-14 w-14 rounded-full object-cover" /><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Assigned specialist</p><p className="mt-1 font-bold text-[#092957]">{selectedSpecialistDoctor}</p></div></div><p className="mt-1 text-xs leading-5 text-slate-500">Doctor names and clinic schedules should be confirmed by DIFF Medical Centre before appointments are finalized.</p>
                              </motion.div>
                            )}
                          </motion.section>
                        )}
                      </AnimatePresence>

                      {/* =================================================
                          CONSULTATION DATE & TIME SLOT CARD
                          Opens after a schedulable consultant/doctor is selected.
                      ================================================= */}
                      <AnimatePresence>
                        {activeSchedulingDoctor && activeDoctorSchedule && (
                          <motion.section
                            key={`schedule-${activeSchedulingDoctor}`}
                            initial={{ opacity: 0, y: 18, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.35, ease: smoothEase }}
                            className="mt-8 overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-[0_18px_45px_rgba(30,64,175,0.08)]"
                          >
                            <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-cyan-50 to-white p-5 sm:p-6">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-700">
                                    Consultation Schedule
                                  </p>
                                  <h4 className="mt-1 text-lg font-extrabold text-[#092957] sm:text-xl">
                                    {({
                                      "john-idahosa": "Dr. John Idahosa",
                                      "ifedi-okonkwo": "Dr. Ifedi Okonkwo",
                                      "dauda-deba-barau": "Dr. Dauda Deba Barau",
                                    } as Record<string, string>)[activeSchedulingDoctor] || activeSchedulingDisplayName}
                                  </h4>
                                  {["john-idahosa", "ifedi-okonkwo", "dauda-deba-barau"].includes(activeSchedulingDoctor) && (
                                    <p className="mt-1 text-sm font-semibold text-cyan-800">
                                      {({
                                        "john-idahosa": "Chief Medical Director, DIFF Medical Centre",
                                        "ifedi-okonkwo": "Director of Clinical Services, DIFF Medical Centre",
                                        "dauda-deba-barau": "Head of O & G",
                                      } as Record<string, string>)[activeSchedulingDoctor]}
                                    </p>
                                  )}
                                  <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Consultation days:{" "}
                                    <strong className="text-slate-800">
                                      {activeDoctorSchedule.days
                                        .map((day) => dayNames[day])
                                        .join(", ")}
                                      {(activeDoctorSchedule.publicHolidayHours ||
                                        activeDoctorSchedule.publicHolidayAppointmentOnly) &&
                                        " + Public Holidays"}
                                    </strong>
                                  </p>
                                  <p className="text-sm leading-6 text-slate-600">
                                    Consultation time:{" "}
                                    <strong className="text-slate-800">
                                      {activeDoctorSchedule.weeklyHours
                                        ? `${formatTime(activeDoctorSchedule.startTime)} – ${formatTime(activeDoctorSchedule.endTime)} Monday–Friday; Saturday ${formatTime(activeDoctorSchedule.weeklyHours[6]!.startTime)} – ${formatTime(activeDoctorSchedule.weeklyHours[6]!.endTime)}; Public holidays ${formatTime(activeDoctorSchedule.publicHolidayHours!.startTime)} – ${formatTime(activeDoctorSchedule.publicHolidayHours!.endTime)}`
                                        : activeDoctorSchedule.publicHolidayAppointmentOnly
                                          ? `${formatTime(activeDoctorSchedule.startTime)} – ${formatTime(activeDoctorSchedule.endTime)} Monday–Friday; Saturday closed; public holidays by appointment (call ahead)`
                                          : `${formatTime(activeDoctorSchedule.startTime)} – ${formatTime(activeDoctorSchedule.endTime)}`}
                                    </strong>
                                  </p>
                                </div>

                                <div className="rounded-xl border border-cyan-100 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm">
                                  <span className="block font-bold text-[#092957]">
                                    {activeDoctorSchedule.slotDuration}-minute slots
                                  </span>
                                  <span className="mt-1 block">
                                    Grey slots are already booked.
                                  </span>
                                </div>
                              </div>
                            </div>

                            {holidaysLoading && (
                              <p className="border-t border-blue-100 bg-blue-50/60 px-5 py-3 text-xs text-blue-800 sm:px-6">
                                Checking the Nigerian public-holiday calendar…
                              </p>
                            )}
                            {holidayApiError && (
                              <p className="border-t border-amber-200 bg-amber-50 px-5 py-3 text-xs leading-5 text-amber-800 sm:px-6">
                                {holidayApiError}
                              </p>
                            )}

                            <div className="space-y-7 p-5 sm:p-6">
                              <div>
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <label className="text-sm font-extrabold text-slate-800">
                                    Select Consultation Date{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  {selectedConsultationDate && (
                                    <span className="text-xs font-semibold text-cyan-700">
                                      {formatDate(selectedConsultationDate)}
                                    </span>
                                  )}
                                </div>

<div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
                                  <div className="mb-4 flex items-center justify-between gap-3">
                                    <button
                                      type="button"
                                      aria-label="Previous month"
                                      disabled={!canGoToPreviousMonth}
                                      onClick={() =>
                                        setVisibleCalendarMonth(
                                          new Date(
                                            calendarMonthStart.getFullYear(),
                                            calendarMonthStart.getMonth() - 1,
                                            1,
                                          ),
                                        )
                                      }
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-30"
                                    >
                                      <span aria-hidden="true">‹</span>
                                    </button>
                                    <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
                                      <select
                                        aria-label="Select calendar month"
                                        value={String(calendarMonthStart.getMonth())}
                                        onChange={(event) =>
                                          setVisibleCalendarMonth(
                                            new Date(
                                              calendarMonthStart.getFullYear(),
                                              Number(event.target.value),
                                              1,
                                            ),
                                          )
                                        }
                                        className="min-w-0 max-w-[54%] rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-[#092957] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 sm:text-sm"
                                      >
                                        {monthOptions.map((month) => (
                                          <option key={month.value} value={month.value}>
                                            {month.label}
                                          </option>
                                        ))}
                                      </select>
                                      <select
                                        aria-label="Select calendar year"
                                        value={String(calendarMonthStart.getFullYear())}
                                        onChange={(event) =>
                                          setVisibleCalendarMonth(
                                            new Date(
                                              Number(event.target.value),
                                              calendarMonthStart.getMonth(),
                                              1,
                                            ),
                                          )
                                        }
                                        className="min-w-0 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-bold text-[#092957] outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 sm:text-sm"
                                      >
                                        {yearOptions.map((year) => (
                                          <option key={year} value={year}>
                                            {year}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <button
                                      type="button"
                                      aria-label="Next month"
                                      onClick={() =>
                                        setVisibleCalendarMonth(
                                          new Date(
                                            calendarMonthStart.getFullYear(),
                                            calendarMonthStart.getMonth() + 1,
                                            1,
                                          ),
                                        )
                                      }
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50"
                                    >
                                      <span aria-hidden="true">›</span>
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-7 gap-1 text-center">
                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                      <div
                                        key={day}
                                        className="py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:text-xs"
                                      >
                                        {day}
                                      </div>
                                    ))}
                                    {calendarDays.map((day) => {
                                      const selected =
                                        selectedConsultationDate === day.value;
                                      const todayValue = [
                                        todayForCalendar.getFullYear(),
                                        String(todayForCalendar.getMonth() + 1).padStart(2, "0"),
                                        String(todayForCalendar.getDate()).padStart(2, "0"),
                                      ].join("-");
                                      const isToday = day.value === todayValue;
                                      const isAvailable = Boolean(day.availableDate);
                                      const isDisabled =
                                        !day.inCurrentMonth || !isAvailable;

                                      return (
                                        <button
                                          key={day.value}
                                          type="button"
                                          disabled={isDisabled}
                                          aria-label={`${day.value}${day.availableDate?.holidayName ? `, ${day.availableDate.holidayName}` : ""}${isAvailable ? ", available" : ", unavailable"}`}
                                          aria-pressed={selected}
                                          title={day.availableDate?.holidayName || (isAvailable ? "Available consultation date" : "Unavailable")}
                                          onClick={() => {
                                            if (!day.availableDate) return;
                                            setSelectedConsultationDate(day.value);
                                            setSelectedConsultationTime("");
                                            setValidationAttempt(0);
                                          }}
                                          className={`relative mx-auto flex aspect-square w-full max-w-[44px] items-center justify-center rounded-xl text-xs font-bold transition-all sm:text-sm ${
                                            selected
                                              ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/25"
                                              : isDisabled
                                                ? "cursor-not-allowed text-slate-300"
                                                : "text-slate-700 hover:bg-cyan-50 hover:text-cyan-700"
                                          } ${isToday && !selected ? "ring-1 ring-cyan-400" : ""}`}
                                        >
                                          {day.day}
                                          {day.availableDate?.holidayName && (
                                            <span
                                              className={`absolute bottom-1 h-1 w-1 rounded-full ${
                                                selected ? "bg-white" : "bg-amber-500"
                                              }`}
                                            />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[10px] text-slate-500 sm:text-xs">
                                    <span className="flex items-center gap-1.5">
                                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
                                      Selected
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                                      Unavailable
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                      Public holiday
                                    </span>
                                  </div>
                                </div>

                                <RequiredFieldError
                                  fieldKey="consultation-date"
                                  show={
                                    validationAttempt > 0 &&
                                    !selectedConsultationDate
                                  }
                                  message="Please select a consultation date."
                                />
                              </div>

                              <AnimatePresence mode="wait">
                                {selectedConsultationDate && (
                                  <motion.div
                                    key={`times-${selectedConsultationDate}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    {selectedDateNeedsCallAhead ? (
                                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                                        <p className="font-extrabold">
                                          Public Holiday — Appointment by Arrangement
                                        </p>
                                        <p className="mt-1">
                                          {publicHolidayByDate.get(selectedConsultationDate)}. Sunshine Family & Psychotherapy Clinic is not offering automatic time slots on public holidays. Please call ahead to confirm availability. Your request will be recorded without a confirmed appointment time.
                                        </p>
                                      </div>
                                    ) : (
                                      <>
                                        {selectedDateIsPublicHoliday && publicHolidayByDate.get(selectedConsultationDate) && (
                                          <p className="mb-3 rounded-lg border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                                            {publicHolidayByDate.get(selectedConsultationDate)} — public-holiday clinic hours apply.
                                          </p>
                                        )}
                                        <div className="mb-3">
                                          <h5 className="text-sm font-extrabold text-slate-800">
                                            Preferred Time Slot{" "}
                                            <span className="text-red-500">*</span>
                                          </h5>
                                          <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {selectedDateHours
                                              ? `Clinic hours: ${formatTime(selectedDateHours.startTime)} – ${formatTime(selectedDateHours.endTime)}. Choose an available time for ${formatDate(selectedConsultationDate)}.`
                                              : `Choose an available time for ${formatDate(selectedConsultationDate)}.`}
                                            {" "}Already booked or elapsed times cannot be selected. All times are WAT.
                                          </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                          {consultationTimeSlots.map((time) => {
                                        const booked =
                                          bookedConsultationSlots.includes(time);
                                        const elapsed = elapsedSlot(selectedConsultationDate, time, clock);
                                        const unavailable = booked || elapsed;
                                        const selected =
                                          selectedConsultationTime === time && !unavailable;

                                        return (
                                          <button
                                            key={time}
                                            type="button"
                                            disabled={unavailable}
                                            aria-disabled={unavailable}
                                            aria-pressed={selected}
                                            onClick={() => {
                                              if (booked || elapsedSlot(selectedConsultationDate, time)) { setClock(Date.now()); return; }
                                              setSubmissionError("");
                                              setSelectedConsultationTime(time);
                                              setValidationAttempt(0);
                                            }}
                                            className={`relative rounded-xl border px-3 py-3 text-sm font-bold transition-all ${
                                              unavailable
                                                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 line-through opacity-70"
                                                : selected
                                                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                                            }`}
                                          >
                                            {formatTime(time)}
                                            {unavailable && (
                                              <span className="mt-1 block text-[9px] font-bold uppercase tracking-wide no-underline">
                                                {elapsed ? "Elapsed" : "Booked"}
                                              </span>
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>

                                        {consultationTimeSlots.length > 0 && consultationTimeSlots.every(time => bookedConsultationSlots.includes(time) || elapsedSlot(selectedConsultationDate, time, clock)) && (
                                          <p className="mt-3 text-sm text-amber-800">No consultation slots remain for this date. Please select another date.</p>
                                        )}
                                        <RequiredFieldError
                                          fieldKey="consultation-time"
                                          show={
                                            validationAttempt > 0 &&
                                            !selectedDateNeedsCallAhead &&
                                            !selectedConsultationTime
                                          }
                                          message="Please select an available consultation time."
                                        />
                                      </>
                                    )}

                                    {selectedConsultationTime && (
                                      <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4"
                                      >
                                        <FaCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />
                                        <div>
                                          <p className="text-sm font-extrabold text-emerald-900">
                                            Preferred appointment selected
                                          </p>
                                          <p className="mt-1 text-xs leading-5 text-emerald-800">
                                            {formatDate(selectedConsultationDate)} at{" "}
                                            {formatTime(selectedConsultationTime)} with{" "}
                                            {activeSchedulingDisplayName}.
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.section>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 3 - REVIEW & CONFIRM
                ================================================= */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.45, ease: smoothEase }}
                    className="py-8 sm:py-10"
                  >
                    <div className="mx-auto max-w-4xl">
                      <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#092957]">
                          <FaClipboardCheck />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-600">
                          Step 3
                        </p>
                        <h2 className="mt-2 text-2xl font-extrabold text-[#123f4e] sm:text-3xl">
                          Review & Confirm
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                          Please carefully review all the patient and appointment information below.
                          Use the Back button if anything needs to be corrected.
                        </p>
                      </div>

                      {/* PATIENT DETAILS REVIEW */}
                      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                            <FaUser />
                          </span>
                          <div>
                            <h3 className="font-extrabold text-[#092957]">Patient Details</h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {newPatient === "Yes" ? "New patient registration information" : "Existing patient information"}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                          {newPatient === "Yes" ? (
                            <>
                              {[
                                ["Patient Type", "New Patient"],
                                ["First Name", firstName],
                                ["Middle Name", middleName],
                                ["Last Name", lastName],
                                ["Email Address", email],
                                ["Gender", gender],
                                ["Phone / Mobile", phone],
                                ["WhatsApp Number", whatsappPhone || "Not provided"],
                                ["Date of Birth", dateOfBirth],
                                ["Contact Address", residentialAddress],
                                ["Local Government Area (LGA)", residentialCity],
                                ["Marital Status", maritalStatus],
                                ["Nationality", nationality],
                                ["State of Origin", stateOfOrigin],
                                ["Next of Kin", nextOfKin],
                                ["Relationship with Next of Kin", nextOfKinRelationship],
                                ["How You Heard About Us", howDidYouHear.join(", ")],
                              ].map(([label, value]) => (
                                <div key={label} className="min-w-0">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || "—"}</p>
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {[
                                ["Patient Type", newPatient === "No" ? "Existing Patient" : "—"],
                                ["First Name", existingFirstName],
                                ["Last Name", existingLastName],
                                ["Email Address", existingEmail],
                                ["Hospital Number", hospitalNumber],
                                ["Phone / Mobile", existingPhone],
                                ["WhatsApp Number", existingWhatsappPhone || "Not provided"],
                              ].map(([label, value]) => (
                                <div key={label} className="min-w-0">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || "—"}</p>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      </section>

                      {/* APPOINTMENT REVIEW */}
                      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#092957]">
                            <FaCalendarCheck />
                          </span>
                          <div>
                            <h3 className="font-extrabold text-[#092957]">Appointment</h3>
                            <p className="mt-1 text-xs text-slate-500">Review your selected appointment pathway and service</p>
                          </div>
                        </div>

                        <div className="grid gap-x-8 gap-y-5 p-5 sm:grid-cols-2 sm:p-6">
                          {[
                            ["Appointment Type", selectedAppointment],
                            ...(selectedAppointment === "OBGYN/IVF"
                              ? [
                                  ["OBGYN / IVF Pathway", obgynIvfPath === "consultants" ? "OBGYN - Consultants" : obgynIvfPath === "ivf" ? "IVF Team" : ""],
                                  ["Selected Consultant / Team Member", selectedConsultant
                                    ? ({
                                        "john-idahosa": "Dr. John Idahosa",
                                        "ifedi-okonkwo": "Dr. Ifedi Okonkwo",
                                        "dauda-deba-barau": "Dr. Dauda Deba Barau",
                                        "adesuwa-evans-ogbebor": "Dr. Adesuwa Evans-Ogbebor — Embryologist Laboratory Director",
                                        "godspower-omogiade": "Godspower Omogiade — Deputy Head, IVF Unit",
                                        "damilola-akinmoluwayan": "Damilola Akinmoluwayan — Head, IVF Nursing Unit",
                                      } as Record<string, string>)[selectedConsultant] || selectedConsultant.replace(/-/g, " ")
                                    : ""],
                                ]
                              : []),
                            ...(selectedAppointment === "Paediatrics" || selectedAppointment === "Other Specialist Consultation"
                              ? [
                                  ["Selected Service", selectedSpecialistService],
                                  ["Assigned Department / Specialist", schedulingDisplayNames[selectedSpecialistDoctor] || selectedSpecialistDoctor],
                                ]
                              : []),
                            ...(selectedConsultationDate
                              ? [
                                  ["Consultation Date", formatDate(selectedConsultationDate)],
                                  ...(selectedConsultationTime
                                    ? [["Preferred Time", formatTime(selectedConsultationTime)]]
                                    : selectedDateNeedsCallAhead
                                      ? [["Preferred Time", "To be confirmed by calling the clinic"]]
                                      : []),
                                ]
                              : []),
                          ].map(([label, value]) => (
                            <div key={label} className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                              <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || "—"}</p>
                            </div>
                          ))}
                          {selectedAppointment === "OBGYN/IVF" && obgynIvfPath === "ivf" && (
                            <div className="sm:col-span-2 rounded-xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm leading-6 text-cyan-950">
                              <strong>Scheduling note:</strong> The IVF Administrators will arrange the appointment. Selecting an IVF team member records your preferred contact and does not confirm a date or time.
                            </div>
                          )}
                          {selectedDateNeedsCallAhead && (
                            <div className="sm:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                              <strong>Scheduling note:</strong> This is a public-holiday appointment request for Sunshine Family & Psychotherapy Clinic. The clinic's availability must be confirmed by phone; no appointment time has been reserved.
                            </div>
                          )}
                        </div>
                      </section>

                      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                        Please confirm that the information shown above is accurate. Your details should only be submitted after you confirm them.
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* =================================================
                    STEP 4 - COMPLETE
                ================================================= */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: smoothEase,
                    }}
                    className="py-12 text-center"
                  >
                    {/* Success icon */}
                    <motion.div
                      initial={{
                        scale: 0,
                      }}
                      animate={{
                        scale: 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 13,
                      }}
                      className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-8 border-emerald-50 bg-emerald-500 text-3xl text-white shadow-lg"
                    >
                      <FaCheckCircle />
                    </motion.div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                      Step 4
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold text-[#123f4e] sm:text-3xl">
                      Appointment Request Complete
                    </h2>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-500">
                      Thank you for choosing DIFF Medical Centre. Our team will
                      review your information and assist you with your
                      appointment.
                    </p>

                    <div className="mx-auto mt-5 max-w-lg rounded-xl border border-cyan-100 bg-cyan-50 p-4" role="status">
                      <p className="text-sm font-semibold text-[#092957]">Booking reference</p>
                      <p className="mt-1 text-xl font-extrabold text-[#092957]">{bookingReference}</p>
                      <p className="mt-2 text-sm font-semibold text-amber-800">Pending Confirmation</p>
                      <p className="mt-2 text-xs text-slate-600">{emailStatus === "accepted" ? "Your acknowledgement email has been submitted for delivery." : "Email delivery could not be verified. Please keep your booking reference."}</p>
                    </div>
                    {/* WhatsApp CTA */}
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-auto mt-7 inline-flex items-center gap-3 rounded-full bg-[#092957] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-700"
                    >
                      <FaWhatsapp />
                      Contact Us on WhatsApp
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* =====================================================
                NAVIGATION BUTTONS
            ===================================================== */}
            {step === 3 && selectionExpired && (
              <p role="alert" className="mx-5 mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{attempt.current ? "The selected time has elapsed. A previous submission may already have been saved; contact DMC if its outcome cannot be verified." : "The selected consultation time has elapsed. Please go back and select another time."}</p>
            )}
            {step === 3 && (
              <div className="mx-5 mb-4 rounded-xl border border-slate-200 bg-white p-4 sm:mx-8 lg:mx-10">
                <p className="mb-3 text-sm font-semibold text-[#092957]">Security verification</p>
                <Turnstile onVerify={setTurnstileToken} resetKey={turnstileResetKey} />
              </div>
            )}
            {(step === 2 || step === 3) && submissionError && (
              <p role="alert" className="mx-5 mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{submissionError}</p>
            )}
            {step < 4 && (
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-8 lg:px-10">
                {/* Back */}
                {step > 1 ? (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    disabled={submitting || (step === 3 && Boolean(attempt.current))}
                    whileHover={{
                      x: -3,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <FaArrowRight className="rotate-180" />
                    Back
                  </motion.button>
                ) : (
                  <div />
                )}

                {/* Next — hidden while IVF Administrator scheduling is required */}
                {!isIvfAdministratorScheduling && (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={submitting || (step === 3 && !turnstileToken)}
                    aria-busy={submitting}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-3 rounded-xl bg-[#092957] px-7 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:bg-cyan-700"
                  >
                    {submitting ? "Submitting…" : step === 3 ? "Submit" : "Next"}
                    <FaArrowRight />
                  </motion.button>
                )}
              </div>
            )}
          </motion.div>

          {/* =====================================================
              TRUST INDICATORS
          ===================================================== */}
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.8,
              duration: 0.6,
            }}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-400"
          >
            <span className="flex items-center gap-1.5">
              <FaShieldAlt className="text-cyan-600" />
              Secure Information
            </span>

            <span className="hidden text-slate-300 sm:block">•</span>

            <span className="flex items-center gap-1.5">
              <FaHeart className="text-cyan-600" />
              Patient-Centred Care
            </span>

            <span className="hidden text-slate-300 sm:block">•</span>

            <span className="flex items-center gap-1.5">
              <FaCheckCircle className="text-cyan-600" />
              Committed To Excellence
            </span>
          </motion.div>
        </div>
      </main>

      {/* =========================================================
          FLOATING WHATSAPP BUTTON
      ========================================================= */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with DIFF Medical Centre on WhatsApp"
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          scale: [1, 1.05, 1],
        }}
        transition={{
          opacity: {
            duration: 0.5,
            delay: 1,
          },
          scale: {
            duration: 2.5,
            delay: 1,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="fixed bottom-5 right-5 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-2xl transition-colors hover:bg-green-600 sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
      >
        <FaWhatsapp />
      </motion.a>
      <Footer />
    </div>
  );
};

export default InPersonBookNow;
