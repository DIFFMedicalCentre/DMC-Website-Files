import { useState, useEffect } from "react";

const Carousel = () => {
  const blogPosts = [
    {
      title: "Regular Checkups and Its Importance",
      excerpt:
        "“Should I go to the hospital for a checkup? Why?” “Yes absolutely! You should go to the hospital at least...",
      imgSrc: "/Lab.jpg",
    },
    {
      title: "Unveiling the Truths, Facts, and Myths About Tuberculosis",
      excerpt:
        "Tuberculosis (TB) is a disease that has lingered for thousands of years, yet, there array of information...",
      imgSrc: "/tuber.jpg",
    },
    {
      title: "Critical Result Policy",
      excerpt:
        "DEFINITION A Critical Value / Critical Result is defined as a value/result that represents a pathophysiological...",
      imgSrc: "/test.jpg",
    },
  ];

  const [offset, setOffset] = useState(0); // Track the offset for continuous movement
  const numOfPosts = blogPosts.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset((prevOffset) => prevOffset + 1); // Move by 1 step every interval
    }, 3000); // Adjust timing as needed for speed

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  // Reset the offset to ensure seamless scrolling once the first set of cards is out
  const adjustedOffset = offset % numOfPosts;

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <h1 className="text-center text-xl font-bold mb-6">Blog</h1>
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${adjustedOffset * (100 / numOfPosts)}%)`, // Smoothly move the entire group of cards
            whiteSpace: "nowrap", // Ensure items remain in a single line
          }}
        >
          {/* Duplicating the slides for seamless infinite scrolling */}
          {[...blogPosts, ...blogPosts].map((post, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-2 bg-white rounded-lg shadow-md border-2 border-gray-300"
              style={{
                minHeight: "350px", // Increased card height to fit more content
              }}
            >
              <img
                className="w-full h-48 object-cover"
                src={post.imgSrc}
                alt={post.title}
              />
              <div className="flex flex-col p-4 h-full">
                <h2 className="text-lg font-bold text-gray-800 mb-2 truncate">
                  {post.title}
                </h2>
                <p className="text-gray-600 mt-2 flex-1 text-sm overflow-hidden text-ellipsis">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          onClick={() => setOffset((prevOffset) => prevOffset + 1)} // Manually control the sliding
        >
          Read More
        </button>
      </div>
    </div>
  );
};

export default Carousel;
