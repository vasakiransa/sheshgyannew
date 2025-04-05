import React, { useState, useEffect } from 'react';
import quizData from './quiz.json'; // Import JSON directly

function Quiz() {
  // Use quizData directly without fetch
  const quiz = quizData.questions[0];

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        background: "#EAF7FF",
        padding: "20px",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
        width: "90%",
        margin: "auto",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}>
        {/* Quiz Question Section */}
        <div style={{
          flex: 2,
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
        }}>
          <div style={{
            background: "#D0ECFF",
            padding: "15px",
            borderRadius: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span style={{ fontWeight: "bold", color: "#0078D7", fontSize: "18px" }}>
              {quizData.progress.current}/{quizData.progress.total}
            </span>
            <span style={{ color: "#0078D7", fontWeight: "bold" }}>{quizData.type}</span>
          </div>

          <h2 style={{ color: "#0078D7", marginTop: "15px" }}>{quiz.question}</h2>
          <p style={{ fontSize: "18px" }}>{quiz.hint}</p>

          {/* Quiz Options */}
          <div>
            {quiz.options.map((option, index) => (
              <button key={index} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "2px solid #00AEEF",
                background: "white",
                fontSize: "16px",
                margin: "10px 0",
                cursor: "pointer",
                transition: "0.3s",
                position: "relative",
                textAlign: "left"
              }} onMouseOver={(e) => e.target.style.background = "#00AEEF"}
                 onMouseOut={(e) => e.target.style.background = "white"}>
                <span style={{
                  width: "30px",
                  height: "30px",
                  background: "#00AEEF",
                  color: "white",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "14px",
                  marginRight: "10px"
                }}>{index + 1}</span>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
