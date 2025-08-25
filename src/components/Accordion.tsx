import React from "react";

interface AccordionProps {
  title: string;
  content: React.ReactNode; // Accepts both string and JSX elements
  isOpen: boolean;
  onClick: () => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  content,
  isOpen,
  onClick,
}) => {
  return (
    <div className="border border-gray-300 rounded-lg mb-2 overflow-hidden">
      <button
        onClick={onClick} // Use the passed click handler
        className="w-full text-left p-4 bg-cyan-950 hover:bg-sky-950 text-white rounded-md font-semibold"
        style={{ height: "50px", display: "flex", alignItems: "center" }} // Fixed height to prevent movement
      >
        {title}
      </button>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden text-justify ${
          isOpen
            ? "max-h-[700px] p-4 border-t border-gray-300 bg-white opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Accordion;
