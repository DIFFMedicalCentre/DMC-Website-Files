import React from "react";
import CountUp from "react-countup";

interface CounterProps {
  end: number;
  duration?: number;
  title: string;
}

const Counter: React.FC<CounterProps> = ({ end, duration = 2, title }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <CountUp end={end} duration={duration} className="text-4xl font-bold" />
      <p className="text-lg mt-2">{title}</p>
    </div>
  );
};

export default Counter;
