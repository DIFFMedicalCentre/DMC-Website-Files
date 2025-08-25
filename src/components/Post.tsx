import React from "react";

const userImages: Record<string, string> = {
  "Dr.ChikaAnireto": "/chika.png",
  "Dr.Adetutu": "/src/assets/Dr.Adetutu.jpeg",
  "Dr.Clement": "/src/assets/Dr.Clement.jpeg",
  "Dr.Halima": "/src/assets/Dr.Halima.jpeg",
  "Dr.Felix": "/src/assets/Dr.Felix.jpeg",
};

interface PostProps {
  username: string;
  message: string;
  timestamp: string | number;
}

const Post: React.FC<PostProps> = ({ username, message, timestamp }) => {
  const date = new Date(timestamp).toLocaleDateString();

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center mb-4">
        <img
          src={userImages[username] || "/src/assets/default.jpg"}
          alt={username}
          className="w-12 h-12 rounded-full mr-4"
        />
        <h2 className="text-lg font-bold">{username}</h2>
      </div>
      <p className="text-gray-700 mb-4">{message}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  );
};

export default Post;
