import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useState } from "react";
import Select from "react-dropdown-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// const VirtualBookNow = () => {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);
//   const [selectedOption, setSelectedOption] = useState<string>("");
//   const [firstName, setFirstName] = useState<string>("");
//   const [lastName, setLastName] = useState<string>("");
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [address, setAddress] = useState<string>("");

const VirtualBookNow = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Selected option: ${selectedOption}`);
  };

  const gender = [
    { label: "Male", value: 1 },
    { label: "Female", value: 2 },
  ];

  const procedure = [
    { label: "Medical Examination", value: 1 },
    { label: "Doctor Check", value: 2 },
    { label: "Result Analysis", value: 3 },
    { label: "Checkup", value: 4 },
  ];

  return (
    <>
      <Navbar />

      {/* Form Section */}
      <div className="flex justify-center flex-col items-center p-4">
        <div className="flex  w-full p-4 flex-col lg:flex-row justify-center items-center gap-4">
          <div className="">
            <img src="Doctor appointment.png" className="w-[600px]"></img>
          </div>
          <div className=" max-w-[800px] flex flex-col items-center">
            <h1
              className="text-4xl lg:text-[3rem] text-sky-950 font-semibold mt-2 text-center"
              style={{ fontFamily: "Agency FB, sans-serif" }}
            >
              Doctor Appointment Request Form
            </h1>

            <p className="text-gray-600 text-xl lg:text-[1.5rem] text-center pt-5 max-w-[600px]">
              Fill the form below and we will get back to you soon for more
              updates and plan for your appointment.
            </p>
          </div>
        </div>

        <div className="w-full max-w-[1200px]">
          <hr className="my-6" />

          <div className=" flex justify-center items-center gap-2 ">
            <input type="checkbox" className="w-5 h-5" checked readOnly />
            <label
              className="text-2xl lg:text-[1.7rem] text-sky-950"
              style={{ fontFamily: "Agency FB, sans-serif" }}
            >
              Virtual Consultation
            </label>
          </div>
          <hr className="my-9" />
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Name Section */}
            <div className="flex flex-col gap-4">
              <label className="text-lg sm:text-xl font-medium">Name</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  className="border shadow-sm w-full sm:w-1/2 h-[2.5rem] text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onFocus={() => setFirstName("")}
                  onBlur={() => !firstName && setFirstName("First Name")}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className="border shadow-sm w-full sm:w-1/2 h-[2.5rem] text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onFocus={() => setLastName("")}
                  onBlur={() => !lastName && setLastName("Last Name")}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Date of Birth Section */}
            <div className="flex gap-3  flex-col">
              <label className="text-lg sm:text-xl font-medium">
                Date of birth
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)} // Updated to handle `Date | null`
                dateFormat="MMMM d, yyyy"
                className="border p-2 text-lg rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholderText="Select a date"
              />
            </div>

            {/* Gender and Phone Number */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/2 flex flex-col gap-4">
                <label className="text-lg sm:text-xl font-medium">Gender</label>
                <Select
                  values={[]}
                  options={gender}
                  onChange={(selectedValues) => console.log(selectedValues)}
                  className="border-2 shadow-sm text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="w-full sm:w-1/2 flex flex-col gap-4">
                <label className="text-lg sm:text-xl font-medium">
                  Phone Number
                </label>
                <input
                  className="border-2 shadow-sm w-full h-[2.5rem] text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  type="text"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onFocus={() => setPhoneNumber("")}
                  onBlur={() => !phoneNumber && setPhoneNumber("Phone Number")}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="flex flex-col gap-4">
              <label className="text-lg sm:text-xl font-medium">Address</label>
              <input
                className="border-2 shadow-sm h-[2.5rem] w-full text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                type="text"
                placeholder="Enter your address"
                value={address}
                onFocus={() => setAddress("")}
                onBlur={() => !address && setAddress("Enter your address")}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Radio Button Section */}
            <div>
              <label className="text-lg sm:text-xl font-medium mb-2 block">
                Have you ever applied to our facility before?
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className="flex items-center text-lg">
                  <input
                    type="radio"
                    value="Yes"
                    checked={selectedOption === "Yes"}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center text-lg">
                  <input
                    type="radio"
                    value="No"
                    checked={selectedOption === "No"}
                    onChange={handleOptionChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            {/* Procedure Selection */}
            <div className="flex flex-col gap-4">
              <label className="text-lg sm:text-xl font-medium">
                Which procedure do you want to make an appointment for?
              </label>
              <Select
                values={[]}
                options={procedure}
                onChange={(selectedValues) => console.log(selectedValues)}
                className="border w-full shadow-sm text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Appointment Date */}
            <div className="flex gap-0 lg:gap-9 items-center">
              <label className="text-lg sm:text-xl font-medium">
                Date of Appointment
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)} // Updated to handle `Date | null`
                dateFormat="MMMM d, yyyy"
                className="border p-2 text-lg rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholderText="Select a date"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button className="p-2 bg-blue-700 w-[500px] text-lg rounded-3xl text-white font-semibold hover:text-blue-300 hover:bg-blue-800 m-10">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default VirtualBookNow;
