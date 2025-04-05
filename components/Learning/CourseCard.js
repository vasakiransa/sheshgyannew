import React from "react";
import Link from "next/link";

const CourseCard = ({
  course: {
    user,
    title,
    slug,
    is_class,
    completedOn = "NA",
    status = "In Progress",
    progress = 0,
    recording = "✓",
    points = 0,
    ratings = "-",
  },
}) => {
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#f5faff", // Light blue background as per the image
          borderRadius: "8px",
          padding: "12px 15px",
          margin: "5px 0",
          width: "100%",
          transition: "transform 0.3s ease",
          ":hover": {
            transform: "translateY(-3px)",
          },
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-3px)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        {/* Course Details in a Table-like Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 2fr 1fr 1fr 1fr", // Adjusted for column widths
            alignItems: "center",
            gap: "15px",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {is_class ? (
              <Link href={`/learning/course/class/${slug}`}>
                <a
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#ff4d7d", // Pink title as per the image
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                    ":hover": {
                      color: "#e0436b", // Slightly darker pink on hover
                    },
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#e0436b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#ff4d7d")
                  }
                >
                  {title}
                </a>
              </Link>
            ) : (
              <Link href={`/learning/course/${slug}`}>
                <a
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "#ff4d7d", // Pink title
                    textDecoration: "none",
                    transition: "color 0.3s ease",
                    ":hover": {
                      color: "#e0436b",
                    },
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#e0436b")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#ff4d7d")
                  }
                >
                  {title}
                </a>
              </Link>
            )}
          </div>

          {/* Completed On */}
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 400,
              color: "#333",
              textAlign: "center",
            }}
          >
            {completedOn}
          </div>

          {/* Status with Progress Bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                fontWeight: 400,
                color: "#333",
                textAlign: "center",
              }}
            >
              {status}
            </span>
            {status === "In Progress" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    height: "5px", // Thinner progress bar as per the image
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      backgroundColor: "#ff4d7d", // Pink progress bar as per the image
                      borderRadius: "5px",
                      transition: "width 0.5s ease-in-out",
                    }}
                  ></div>
                </div>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "#ff4d7d", // Pink progress percentage
                    fontWeight: 400,
                  }}
                >
                  {progress}
                </span>
              </div>
            )}
          </div>

          {/* Recording */}
          <div
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "#00c4b4", // Teal checkmark as per the image
              textAlign: "center",
            }}
          >
            {recording}
          </div>

          {/* Points */}
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#ffd700", // Gold points as per the image
              backgroundColor: "#ffd70020",
              padding: "5px",
              borderRadius: "50%",
              textAlign: "center",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
            }}
          >
            {points}
          </div>

          {/* Ratings */}
          <div
            style={{
              fontSize: "0.9rem",
              fontWeight: 400,
              color: "#333",
              textAlign: "center",
            }}
          >
            {ratings}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;