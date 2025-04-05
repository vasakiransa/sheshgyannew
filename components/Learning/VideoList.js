import React from "react";
import { secondsToHms } from "@/utils/helper";

const VideoList = ({
  id,
  title,
  short_id,
  video_length,
  onPlay,
  activeClass,
}) => {
  return (
    <li
      className={`video-list-item ${activeClass === id ? "active" : ""}`}
      onClick={() => onPlay(id)}
    >
      {short_id}. {title}
      <span className="video-duration">
        <i className="bx bx-play-circle"></i> {secondsToHms(video_length)}
      </span>
      <style jsx>{`
        .video-list-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease-in-out;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .video-list-item:hover,
        .video-list-item.active {
          background-color: #f0f0f0;
          color: #0056b3;
        }

        .video-duration {
          font-size: 0.75rem;
          color: #6c757d;
        }
      `}</style>
    </li>
  );
};

export default VideoList;
