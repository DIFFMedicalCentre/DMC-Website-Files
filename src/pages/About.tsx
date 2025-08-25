import { useState } from "react";
import Navbar from "../components/Navbar";
import VideoPlayer from "../components/VideoPlayer";
import Footer from "../components/Footer";
import Accordion from "../components/Accordion";

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<
    number | null
  >(null);

  // Function to toggle the "Read More" section
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  // Accordion data
  const accordionData = [
    {
      title: "Our Mission",
      content:
        "Use the private medical sector to create a credible and harmonious platform on which clinicians and support units operating in a decentralized arrangement are able to provide integrated, comprehensive, effective, and first-class clinical services through the deployment of a well-motivated workforce using state-of-the-art diagnostic and therapeutic facilities; thereby advancing disease prevention, promoting client recovery, fostering learning, encouraging research, reducing client morbidity, eliminating avoidable mortality, and reducing medical tourism.",
    },
    {
      title: "Our Vision",
      content:
        "To be the leading healthcare provider, advancing medical excellence, innovation, and patient-centered care to enhance the well-being of the communities we serve..",
    },
    {
      title: "Our Values",
      content: (
        <>
          <p>
            Our Values are encapsulated in the acronym <strong>SPECS</strong>,
            which means:
          </p>
          <ul className="list-disc list-inside ml-5 mt-2">
            <li>
              <strong>S</strong> = SINCERITY
            </li>
            <li>
              <strong>P</strong> = PROFESSIONALISM
            </li>
            <li>
              <strong>E</strong> = EXCELLENCE
            </li>
            <li>
              <strong>C</strong> = COMMITMENT
            </li>
            <li>
              <strong>S</strong> = SOPHISTICATION
            </li>
          </ul>
        </>
      ),
    },
  ];

  // Handle accordion toggle
  const handleAccordionToggle = (index: number) => {
    setActiveAccordionIndex(activeAccordionIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />

      <div className="section-offset bg-sky-950 text-white flex justify-center p-5 text-4xl font-semibold">
        About DIFF Medical Centre
      </div>

      {/* Main container for Overview and VideoPlayer */}
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto items-center p-5 gap-2">
        {/* Overview section */}
        <div className="p-5 text-center md:text-left flex-1">
          <h1 className="font-bold text-2xl mb-4">Overview</h1>
          <p className="text-justify">
            DIFF Medical Centre was formally known as DIFF Hospital. The Acronym
            DIFF stands for DIVINE, FAVOUR, and FAITH. These are the names of a
            set of triplets (two boys and one girl) born to the family of the
            Chief Medical Director and the Executive Director of Administration
            on the 26th of February, 2001; after 9 years of infertility. The
            birth of this triplet inspired the creation of the DIFF Concept and
            modulates the path of excellence we tread, and drives the passion of
            exceptional creativity with which DMC operates.
          </p>

          {/* Read More Section */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isExpanded ? "max-h-[1000px]" : "max-h-0"
            }`}
          >
            <p className="mt-2">
              DIFF Hospital stands as a beacon of quality healthcare services,
              offering a wide range of treatments and innovative medical
              approaches that cater to the health needs of individuals and
              families across the region.
            </p>
          </div>
          <button
            onClick={toggleReadMore}
            className="text-blue-500 hover:underline mt-2 ease-in-out"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>

        {/* VideoPlayer section */}
        <div className="flex-1">
          <VideoPlayer />
        </div>
      </div>

      {/* Accordion section */}
      <div className="max-w-4xl mx-auto p-4">
        {accordionData.map((item, index) => (
          <Accordion
            key={index}
            title={item.title}
            content={item.content} // Now correctly typed
            isOpen={activeAccordionIndex === index}
            onClick={() => handleAccordionToggle(index)}
          />
        ))}
      </div>

      <Footer />
    </>
  );
};

export default About;
