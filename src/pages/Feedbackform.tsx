import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import type { FormEvent } from "react";

const Feedbackform = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/thankspage");
  };
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />
      <div className="bg-blue-950 py-4"></div>

      {/* Form Container */}
      <div className="max-w-3xl mx-auto px-6 py-8 text-center">
        <h1 className="text-3xl font-bold">Patient Feedback Form</h1>
        <p className="text-gray-700 mt-2 mb-6">
          Thank you for choosing our clinic for your medical needs. Please
          provide feedback on your visit so we can continue improving our
          services. We appreciate your time!
        </p>

        <form
          onSubmit={handleSubmit}
          name="feedback"
          method="POST"
          action="/thankspage.html"
          data-netlify="true"
          netlify-honeypot="bot-field"
          className="space-y-8 text-left"
        >
          {/* Hidden fields for Netlify */}
          <input type="hidden" name="form-name" value="feedback" />
          <input type="hidden" name="bot-field" />

          {/* Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="border border-gray-300 px-4 py-2 rounded w-full"
            />
            <input
              type="text"
              name="contact"
              placeholder="Email or telephone"
              className="border border-gray-300 px-4 py-2 rounded w-full"
            />
          </div>

          {/* Gender and DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="gender"
              className="border border-gray-300 px-4 py-2 rounded w-full text-gray-600"
            >
              <option>Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input
              type="date"
              name="dob"
              className="border border-gray-300 px-4 py-2 rounded w-full text-gray-600"
            />
          </div>

          {/* Recommendation Radio Group */}
          <div>
            <p className="font-medium mb-2">
              How likely are you to recommend us to your friends and family?
            </p>
            <div className="space-y-2 pl-2">
              {[
                "Never",
                "Not very likely",
                "Somewhat likely",
                "Likely",
                "Very likely",
              ].map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="recommendation"
                    value={option}
                    id={`recommendation-${idx}`}
                  />
                  <label htmlFor={`recommendation-${idx}`}>{option}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Satisfaction Matrix */}
          <div>
            <p className="font-medium mb-2">
              Please rate your satisfaction with the hospital and provided
              service by rating the following statements:
            </p>

            <div className="overflow-auto">
              <table className="table-auto w-full border-separate border-spacing-y-2 text-sm">
                <thead>
                  <tr>
                    <th className="text-left"></th>
                    {[
                      "Very Dissatisfied",
                      "Dissatisfied",
                      "Neutral",
                      "Satisfied",
                      "Very Satisfied",
                    ].map((col, idx) => (
                      <th key={idx} className="text-center px-2">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    "The overall quality of care received",
                    "Communication & clarity of information provided",
                    "Cleanliness & maintenance of hospital facilities",
                    "Information provided for diagnosis and treatment.",
                    "Efficiency of admission & discharge process",
                  ].map((row, rowIndex) => (
                    <tr key={rowIndex} className="text-left">
                      <td className="pr-4 py-2">{row}</td>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <td key={i} className="text-center">
                            <input
                              type="radio"
                              name={`rating-${rowIndex}`}
                              value={i + 1}
                              className="form-radio"
                            />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DMC Staff Impact Input */}
          <div>
            <label className="font-medium block mb-2">
              Which DMC Staff made the most impact for you today?
            </label>
            <input
              type="text"
              name="impactful-staff"
              className="w-full border border-gray-300 px-4 py-2 rounded"
              placeholder="e.g., Nurse Mary, Dr. Ahmed"
            />
          </div>

          {/* Textarea */}
          <div>
            <label className="font-medium block mb-2">
              Tell us how we can improve:
            </label>
            <textarea
              rows={4}
              name="suggestions"
              className="w-full border border-gray-300 px-4 py-2 rounded"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-950 text-white font-semibold
        focus:ring-2 focus:ring-blue-500
        focus:ring-offset-2 transition rounded-full w-full max-w-xs mx-auto px-8 py-3"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
      <div className="bg-blue-950 py-4"></div>
    </div>
  );
};

export default Feedbackform;
