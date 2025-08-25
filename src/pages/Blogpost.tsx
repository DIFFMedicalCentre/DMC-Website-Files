import { useState } from "react";
import Post from "../components/Post";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Blogpost = () => {
  const [posts] = useState([
    {
      username: "Dr.ChikaAnireto",
      message: "Dealing with Trauma...",
      timestamp: new Date().toISOString(),
    },
    {
      username: "Dr.Adetutu",
      message: "Preventive measures...",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      username: "Dr.Clement",
      message: "Best way to treat burns...",
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      username: "Dr.Halima",
      message: "World Cardiovascular Day...",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      username: "Dr.Felix",
      message: "Why sickle cell...",
      timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
  ]);

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to DMC Blog</h1>
          <p className="text-gray-600">Explore the latest health tips</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          {posts.map((post, index) => (
            <Post
              key={index}
              username={post.username}
              message={post.message}
              timestamp={post.timestamp}
            />
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Blogpost;
