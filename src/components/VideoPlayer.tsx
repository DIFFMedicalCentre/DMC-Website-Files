import React from "react";

const VideoPlayer: React.FC = () => {
  return (
    <div className="w-full max-w-[1200px] mx-auto p-2">
      <div className="aspect-video">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/lx6INFzbpME?si=zr3MkMtMG5H7tV6k"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
