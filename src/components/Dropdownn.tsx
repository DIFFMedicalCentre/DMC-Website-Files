import { useState } from "react";
import { AiOutlineCaretUp, AiOutlineCaretDown } from "react-icons/ai";

const OurValues = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Sample list of items with dummy text
  const list = [
    { id: 1, text: "S = SINCERITY" },
    {
      id: 2,
      text: "P = PROFESSIONALISM",
    },
    {
      id: 3,
      text: "E = EXCELLENCE",
    },
    { id: 4, text: "C = COMMITMENT" },
    {
      id: 5,
      text: "S = SOPHISTICATION",
    },
  ];

  return (
    <div className="relative flex flex-col items-center rounded-lg">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-blue-400 p-4 w-full flex items-center justify-between font-bold text-lg rounded-lg tracking-wider border-4 border-transparent active:border-white duration-300 active:text-white"
      >
        OUR VALUES
        {!isOpen ? (
          <AiOutlineCaretDown className="h-8" />
        ) : (
          <AiOutlineCaretUp className="h-8" />
        )}
      </button>
      {isOpen && (
        <div className="bg-blue-400 absolute top-20 flex flex-col items-start rounded-lg p-2 w-full">
          {list.map((item) => (
            <div key={item.id} className="text-white p-2">
              <h3>{item.text}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OurValues;
