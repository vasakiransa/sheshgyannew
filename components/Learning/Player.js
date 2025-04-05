import React, { useEffect, useState } from "react";

const Player = ({ src }) => { //Renamed prop videoSrc to src for generality
    const [source, setSource] = useState(src);
    const [isImage, setIsImage] = useState(false); // Add state to track if it's an image

    useEffect(() => {
        setSource(src);
        //Determine if the source is an image or a video
        if (src) {
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const lowerCaseSrc = src.toLowerCase();
            setIsImage(imageExtensions.some(ext => lowerCaseSrc.endsWith(ext)));
        } else {
            setIsImage(false); // Reset if src is empty
        }
    }, [src]);

    return (

        <div className="video-player">
            {isImage ? (
                <img key={source} src={source} alt="Selected Asset" style={{ width: '100%', height: 'auto' }} onError={(e) => {
                    console.error("Error loading image:", source);
                    e.target.onerror = null; // Prevents infinite loop
                    e.target.src = "URL_TO_DEFAULT_IMAGE"; // Replace with a default image
                }} />
            ) : (
                <video key={source} width="100%" height="auto" controls>
                    <source src={source} type="video/mp4" onError={(e) => {
                        console.error("Error loading video:", source);
                        e.target.onerror = null;
                        //Optionally display a fallback message or component
                    }} />
                    Your browser does not support the video tag.
                </video>
            )}
            <style jsx>{`
        .video-player {
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
        }
      `}</style>
        </div>
    );
};

export default Player
