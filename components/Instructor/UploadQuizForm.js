import React, { useState } from 'react';
import axios from 'axios';
import baseUrl from '@/utils/baseUrl';
import { parseCookies } from 'nookies';
import toast from 'react-hot-toast';
import LoadingSpinner from "@/utils/LoadingSpinner";



// Modified Quiz Form
const QuizForm = ({ onQuizUploadComplete, courseId }) => {
    const [questions, setQuestions] = useState([{
        questionText: "",
        questionImage: null, // New: Question image
        questionImagePreview: null, // New: Question image preview
        options: [
            { text: "", image: null, imagePreview: null, isCorrect: false }, //New image field
            { text: "", image: null, imagePreview: null, isCorrect: false },
            { text: "", image: null, imagePreview: null, isCorrect: false },
            { text: "", image: null, imagePreview: null, isCorrect: false }
        ],
    }]);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                questionText: "",
                questionImage: null,
                questionImagePreview: null,
                options: [
                    { text: "", image: null, imagePreview: null, isCorrect: false },
                    { text: "", image: null, imagePreview: null, isCorrect: false },
                    { text: "", image: null, imagePreview: null, isCorrect: false },
                    { text: "", image: null, imagePreview: null, isCorrect: false }
                ],
            },
        ]);
    };

    const handleQuestionChange = (index, event) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = event.target.value;
        setQuestions(newQuestions);
    };

    const handleQuestionImageChange = (index, event) => {
        const { files } = event.target;
        if (files && files[0]) {
            const newQuestions = [...questions];
            newQuestions[index].questionImage = files[0];
            newQuestions[index].questionImagePreview = URL.createObjectURL(files[0]);
            setQuestions(newQuestions);
        }
    };

    const handleOptionChange = (questionIndex, optionIndex, event) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex].text = event.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionImageChange = (questionIndex, optionIndex, event) => {
        const { files } = event.target;
        if (files && files[0]) {
            const newQuestions = [...questions];
            newQuestions[questionIndex].options[optionIndex].image = files[0];
            newQuestions[questionIndex].options[optionIndex].imagePreview = URL.createObjectURL(files[0]);
            setQuestions(newQuestions);
        }
    };

    const handleCorrectAnswerChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options = newQuestions[questionIndex].options.map((option, index) => ({
            ...option,
            isCorrect: index === optionIndex,
        }));
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Function to upload image and return URL
        const uploadImage = async (imageFile) => {
            if (!imageFile) return null;
            const data = new FormData();
            data.append("file", imageFile);
            data.append("upload_preset", process.env.UPLOAD_PRESETS);
            data.append("cloud_name", process.env.CLOUD_NAME);
            const response = await axios.post(process.env.CLOUDINARY_URL, data);
            return response.data.url;
        };

        // Upload images and create quiz data
        const quizData = await Promise.all(
            questions.map(async (question) => {
                const questionImageUrl = await uploadImage(question.questionImage);
                const optionsWithImageUrls = await Promise.all(
                    question.options.map(async (option) => {
                        const optionImageUrl = await uploadImage(option.image);
                        return { ...option, image: optionImageUrl };
                    })
                );

                return {
                    questionText: question.questionText,
                    questionImage: questionImageUrl,
                    options: optionsWithImageUrls,
                };
            })
        );

        // Call the callback function with the quiz data
        onQuizUploadComplete(quizData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {questions.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-4">
                    <h4 className="mb-3">Question {questionIndex + 1}</h4>

                    {/* Question Text Input */}
                    <div className="mb-3">
                        <label className="form-label">Question Text</label>
                        <input
                            type="text"
                            className="form-control"
                            value={question.questionText}
                            onChange={(event) => handleQuestionChange(questionIndex, event)}
                        />
                    </div>

                    {/* Question Image Upload */}
                    <div className="mb-3">
                        <label className="form-label">Question Image</label>
                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(event) => handleQuestionImageChange(questionIndex, event)}
                        />
                        {question.questionImagePreview && (
                            <img
                                src={question.questionImagePreview}
                                alt="Question Preview"
                                style={{ maxWidth: "100px", marginTop: "10px" }}
                            />
                        )}
                    </div>

                    {/* Options */}
                    {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name={`question-${questionIndex}`}
                                    id={`question-${questionIndex}-option-${optionIndex}`}
                                    checked={option.isCorrect}
                                    onChange={() => handleCorrectAnswerChange(questionIndex, optionIndex)}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`question-${questionIndex}-option-${optionIndex}`}
                                >
                                    Correct Answer
                                </label>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Option {optionIndex + 1} Text</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={option.text}
                                    onChange={(event) => handleOptionChange(questionIndex, optionIndex, event)}
                                />
                            </div>
                            {/* Option Image Upload */}
                            <div className="mb-3">
                                <label className="form-label">Option {optionIndex + 1} Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={(event) => handleOptionImageChange(questionIndex, optionIndex, event)}
                                />
                                {option.imagePreview && (
                                    <img
                                        src={option.imagePreview}
                                        alt={`Option ${optionIndex + 1} Preview`}
                                        style={{ maxWidth: "100px", marginTop: "10px" }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ))}

            <button type="button" className="btn btn-secondary" onClick={handleAddQuestion}>
                Add Question
            </button>
            <button type="submit" className="btn btn-primary">
                Upload Quiz
                    
                </button>
            </form>

     

    );
};

export default QuizForm;
