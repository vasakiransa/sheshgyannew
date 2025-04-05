import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import baseUrl from "@/utils/baseUrl";
import LoadingSpinner from "@/utils/LoadingSpinner";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const INITIAL_VALUE = {
    title: "",
    short_desc: "",
    overview: "",
    latest_price: "",
    before_price: "",
    lessons: "",
    duration: "",
    image: "",
    access_time: "",
    requirements: "",
    what_you_will_learn: "",
    who_is_this_course_for: "",
    catId: "",
};

const SIMULATOR_TYPES = [
    { value: "python", label: "Python Simulator" },
    { value: "blockly", label: "Blockly Simulator" },
];

const CourseUpdateForm = ({ courseData, initialCourseContent }) => {
    const { elarniv_users_token } = parseCookies();
    const [course, setCourse] = useState(INITIAL_VALUE);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState("");
    const router = useRouter();

    const [courseContent, setCourseContent] = useState(initialCourseContent || []);
    const [selectedContentType, setSelectedContentType] = useState("");
    const [pageNumber, setPageNumber] = useState("");
    const [simulatorType, setSimulatorType] = useState("python");

    const [textValue, setTextValue] = useState("");
    const [simulatorValue, setSimulatorValue] = useState("");
    const [quizQuestion, setQuizQuestion] = useState("");
    const [quizOptions, setQuizOptions] = useState([
        { value: "", type: "text", isCorrect: false, file: null },
        { value: "", type: "text", isCorrect: false, file: null },
        { value: "", type: "text", isCorrect: false, file: null },
        { value: "", type: "text", isCorrect: false, file: null },
    ]);

    const [videoFile, setVideoFile] = useState(null);
    const [assetFile, setAssetFile] = useState(null);
    const [videoUploadLoading, setVideoUploadLoading] = useState(false);
    const [assetUploadLoading, setAssetUploadLoading] = useState(false);
    const [editContent, setEditContent] = useState(null);

    useEffect(() => {
        if (courseData) {
            setCourse(courseData);
        }
    }, [courseData]);

    useEffect(() => {
        const isCourse = Object.values(course).every((el) => Boolean(el));
        setDisabled(!isCourse);
    }, [course]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const payload = { headers: { Authorization: elarniv_users_token } };
                const response = await axios.get(`${baseUrl}/api/categories`, payload);
                setCategories(response.data.categories);
            } catch (error) {
                toast.error("Failed to load categories.");
            }
        };
        fetchData();
        fetchCourseContent(); // Fetch updates after initial load
    }, [elarniv_users_token, courseData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            if (files[0].size / 1024 / 1024 > 2) {
                toast.error("Image size must be less than 2 MB.");
                e.target.value = null;
                return;
            }
            setCourse((prev) => ({ ...prev, image: files[0] }));
            setImagePreview(window.URL.createObjectURL(files[0]));
        } else {
            setCourse((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleTextChange = (e) => setTextValue(e.target.value);
    const handleSimulatorChange = (e) => setSimulatorValue(e.target.value);
    const handleQuizQuestionChange = (e) => setQuizQuestion(e.target.value);

    const handleQuizOptionChange = (index, e) => {
        const newOptions = [...quizOptions];
        if (e.target.type === "file") {
            newOptions[index].file = e.target.files[0];
            newOptions[index].value = ""; // Clear text value if file is uploaded
        } else {
            newOptions[index].value = e.target.value;
            newOptions[index].file = null; // Clear file if text is entered
        }
        setQuizOptions(newOptions);
    };

    const handleQuizOptionTypeChange = (index, e) => {
        const newOptions = [...quizOptions];
        newOptions[index].type = e.target.value;
        setQuizOptions(newOptions);
    };

    const handleQuizOptionCorrectChange = (index) => {
        const newOptions = quizOptions.map((opt, i) => ({
            ...opt,
            isCorrect: i === index, // Only one option can be correct
        }));
        setQuizOptions(newOptions);
    };

    const handleImageUpload = async () => {
        try {
            const data = new FormData();
            data.append("file", course.image);
            data.append("upload_preset", process.env.UPLOAD_PRESETS);
            data.append("cloud_name", process.env.CLOUD_NAME);
            const response = await axios.post(process.env.CLOUDINARY_URL, data);
            return response.data.url.replace(/^http:/i, "https:");
        } catch (error) {
            toast.error("Image upload failed.");
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let photo = course.image;

            if (course.image instanceof File) {
                photo = await handleImageUpload();
                if (!photo) {
                    setLoading(false);
                    return;
                }
            }

            const payloadData = { ...course, image: photo };
            const payloadHeader = { headers: { Authorization: elarniv_users_token } };
            const url = `${baseUrl}/api/courses/course/${courseData.id}`;
            const response = await axios.put(url, payloadData, payloadHeader);
            setLoading(false);

            toast.success(response.data.message);
            router.push(`/instructor/courses`);
        } catch (err) {
            toast.error(err.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const uploadFile = async (file, courseId, folderType) => {
        if (!file) return null;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", `${folderType}/${courseId}`);
        formData.append("pageNumber", pageNumber);

        try {
            setVideoUploadLoading(true);
            const response = await axios.post("/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Upload response:", response.data);
            return response.data.fileUrl;
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(`Upload failed: ${error.response?.data?.error || error.message || "Unknown error"}`);
            return null;
        } finally {
            setVideoUploadLoading(false);
        }
    };

    const fetchCourseContent = async () => {
        try {
            const response = await axios.get(`/api/get-content?courseId=${courseData.id}`);
            console.log("Fetched course content:", response.data.content); // Debug log
            setCourseContent(response.data.content || initialCourseContent);
        } catch (error) {
            console.error("Failed to fetch course content:", error);
            toast.error("Failed to load course content dynamically.");
            setCourseContent(initialCourseContent); // Fallback to initial content
        }
    };

    const handleAddContentClick = async () => {
        try {
            let contentData = {};
            let fileUrl = null;
            switch (selectedContentType) {
                case "text":
                    contentData = { text: textValue };
                    break;
                case "simulator":
                    contentData = { simulator: simulatorValue, type: simulatorType };
                    break;
                case "video":
                    fileUrl = await uploadFile(videoFile, courseData.id, "uploadedvideo");
                    if (fileUrl) {
                        contentData = { video: videoFile.name, url: fileUrl };
                    } else {
                        throw new Error("Video upload failed");
                    }
                    break;
                case "asset":
                    setAssetUploadLoading(true);
                    fileUrl = await uploadFile(assetFile, courseData.id, "uploadedasset");
                    if (fileUrl) {
                        contentData = { url: fileUrl };
                    }
                    setAssetUploadLoading(false);
                    break;
                case "quiz":
                    const uploadedOptions = await Promise.all(
                        quizOptions.map(async (opt) => {
                            if (opt.type === "image" && opt.file) {
                                const url = await uploadFile(opt.file, courseData.id, "quizimages");
                                return { value: url, type: opt.type, isCorrect: opt.isCorrect };
                            }
                            return { value: opt.value, type: opt.type, isCorrect: opt.isCorrect };
                        })
                    );
                    contentData = {
                        quiz: {
                            question: quizQuestion,
                            options: uploadedOptions,
                        },
                    };
                    break;
            }

            if ((selectedContentType === "video" || selectedContentType === "asset") && !fileUrl) {
                toast.error("File upload failed.");
                return;
            }

            const payload = {
                courseId: courseData.id,
                pageNumber: pageNumber,
                contentType: selectedContentType,
                contentData: contentData,
            };

            await axios.post(`/api/save-content`, payload);
            toast.success("Content saved successfully!");
            fetchCourseContent();
            resetContentForm();
        } catch (error) {
            console.error("Error saving content:", error);
            toast.error(`Save failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleUpdateContentClick = async () => {
        if (!editContent) return;

        try {
            let contentData = {};
            let fileUrl = null;
            switch (selectedContentType) {
                case "text":
                    contentData = { text: textValue };
                    break;
                case "simulator":
                    contentData = { simulator: simulatorValue, type: simulatorType };
                    break;
                case "video":
                    fileUrl = await uploadFile(videoFile, courseData.id, "uploadedvideo");
                    if (fileUrl) {
                        contentData = { video: videoFile.name, url: fileUrl };
                    } else {
                        throw new Error("Video upload failed");
                    }
                    break;
                case "asset":
                    setAssetUploadLoading(true);
                    fileUrl = await uploadFile(assetFile, courseData.id, "uploadedasset");
                    if (fileUrl) {
                        contentData = { url: fileUrl };
                    }
                    setAssetUploadLoading(false);
                    break;
                case "quiz":
                    const uploadedOptions = await Promise.all(
                        quizOptions.map(async (opt) => {
                            if (opt.type === "image" && opt.file) {
                                const url = await uploadFile(opt.file, courseData.id, "quizimages");
                                return { value: url, type: opt.type, isCorrect: opt.isCorrect };
                            }
                            return { value: opt.value, type: opt.type, isCorrect: opt.isCorrect };
                        })
                    );
                    contentData = {
                        quiz: {
                            question: quizQuestion,
                            options: uploadedOptions,
                        },
                    };
                    break;
            }

            const payload = {
                courseId: courseData.id,
                pageNumber: editContent.pageNumber,
                contentType: selectedContentType,
                contentData: contentData,
            };

            await axios.post(`/api/save-content`, payload);
            toast.success("Content updated successfully!");
            fetchCourseContent();
            resetContentForm();
            setEditContent(null);
        } catch (error) {
            console.error("Error updating content:", error);
            toast.error(`Update failed: ${error.message || "Unknown error"}`);
        }
    };

    const handleDeletePage = async (pageNumber) => {
        if (window.confirm(`Are you sure you want to delete Page ${pageNumber}?`)) {
            try {
                await axios.delete(`/api/delete-content`, {
                    data: { courseId: courseData.id, pageNumber },
                });
                toast.success(`Page ${pageNumber} deleted successfully!`);
                fetchCourseContent();
            } catch (error) {
                toast.error(`Failed to delete page: ${error.message || "Unknown error"}`);
            }
        }
    };

    const handleDeleteContent = async (pageNumber, contentType) => {
        if (window.confirm("Are you sure you want to delete this content?")) {
            try {
                await axios.delete(`/api/delete-content`, {
                    data: { courseId: courseData.id, pageNumber, contentType },
                });
                toast.success("Content deleted successfully!");
                fetchCourseContent();
            } catch (error) {
                toast.error(`Failed to delete content: ${error.message || "Unknown error"}`);
            }
        }
    };

    const handleEditContent = (content) => {
        setEditContent(content);
        setSelectedContentType(content.contentType);
        setPageNumber(content.pageNumber);
        switch (content.contentType) {
            case "text":
                setTextValue(content.contentData.text || "");
                break;
            case "simulator":
                setSimulatorValue(content.contentData.simulator || "");
                setSimulatorType(content.contentData.type || "python");
                break;
            case "video":
                setVideoFile(null);
                break;
            case "asset":
                setAssetFile(null);
                break;
            case "quiz":
                setQuizQuestion(content.contentData.quiz.question || "");
                setQuizOptions(content.contentData.quiz.options.map(opt => ({
                    ...opt,
                    file: null, // Reset file for editing
                })) || [
                    { value: "", type: "text", isCorrect: false, file: null },
                    { value: "", type: "text", isCorrect: false, file: null },
                    { value: "", type: "text", isCorrect: false, file: null },
                    { value: "", type: "text", isCorrect: false, file: null },
                ]);
                break;
        }
    };

    const resetContentForm = () => {
        setSelectedContentType("");
        setPageNumber("");
        setTextValue("");
        setSimulatorValue("");
        setSimulatorType("python");
        setQuizQuestion("");
        setQuizOptions([
            { value: "", type: "text", isCorrect: false, file: null },
            { value: "", type: "text", isCorrect: false, file: null },
            { value: "", type: "text", isCorrect: false, file: null },
            { value: "", type: "text", isCorrect: false, file: null },
        ]);
        setVideoFile(null);
        setAssetFile(null);
    };

    const handleAddPage = () => {
        const newPageNumber = courseContent.length > 0
            ? Math.max(...courseContent.map((c) => parseInt(c.pageNumber || 0))) + 1
            : 1;
        setPageNumber(newPageNumber.toString());
    };

    const handleVideoFileChange = (e) => setVideoFile(e.target.files[0]);
    const handleAssetFileChange = (e) => setAssetFile(e.target.files[0]);

    const renderContent = (content) => {
        console.log("Rendering content:", content); // Debug log
        const info = content.contentData || {};

        if (content.contentType === "video" && "video" in info && "url" in info) {
            return (
                <div>
                    <p><strong>Video Name:</strong> {info.video || "No video name provided"}</p>
                    <video src={info.url} controls width="300" style={{ marginTop: "10px" }} />
                </div>
            );
        }

        if (content.contentType === "text" && "text" in info) {
            return <p>{info.text || "No text provided"}</p>;
        }

        if (content.contentType === "simulator" && "simulator" in info) {
            return (
                <div>
                    <p><strong>Type:</strong> {info.type || "Unknown simulator type"}</p>
                    <pre>{info.simulator || "No simulator content provided"}</pre>
                </div>
            );
        }

        if (content.contentType === "asset" && "url" in info) {
            return <a href={info.url} target="_blank" rel="noopener noreferrer">Download Asset</a>;
        }

        if (content.contentType === "quiz" && "quiz" in info) {
            return (
                <div>
                    <p><strong>Question:</strong> {info.quiz.question || "No question"}</p>
                    <ul>
                        {info.quiz.options?.map((opt, idx) => (
                            <li key={idx}>
                                {opt.type === "text" ? opt.value : <img src={opt.value} alt={`Option ${idx + 1}`} style={{ maxWidth: "100px" }} />}
                                {opt.isCorrect && <span> (Correct)</span>}
                            </li>
                        )) || <li>No options provided</li>}
                    </ul>
                </div>
            );
        }

        return <p>Unknown content type: {JSON.stringify(content)}</p>; // Enhanced fallback
    };

    const Metabox = courseContent.reduce((acc, content) => {
        const page = content.pageNumber || "Unassigned";
        if (!acc[page]) acc[page] = [];
        acc[page].push(content);
        return acc;
    }, {});

    return (
        <>
            <LoadingSpinner loading={loading} />
            <form className="dashboard-course-create-form" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="form-group">
                            <label>Course Title</label>
                            <input type="text" className="form-control" name="title" value={course.title} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <button type="submit" className="default-btn" disabled={disabled}>
                            Update Course
                        </button>
                    </div>
                </div>
            </form>

            <div className="create-course-content">
                <h3>Course Content</h3>
                <div className="content-add-options">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="form-group">
                                <label>Select Content Type</label>
                                <select className="form-control" value={selectedContentType} onChange={(e) => setSelectedContentType(e.target.value)}>
                                    <option value="">Select Content Type</option>
                                    <option value="text">Text</option>
                                    <option value="simulator">Simulator</option>
                                    <option value="video">Video</option>
                                    <option value="asset">Asset</option>
                                    <option value="quiz">Quiz</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="form-group">
                                <label>Page Number</label>
                                <input type="number" className="form-control" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {selectedContentType === "text" && (
                    <div className="form-group">
                        <label>Text Content</label>
                        <textarea className="form-control" rows="5" value={textValue} onChange={handleTextChange} />
                    </div>
                )}

                {selectedContentType === "simulator" && (
                    <div>
                        <div className="form-group">
                            <label>Select Simulator Type</label>
                            <select className="form-control" value={simulatorType} onChange={(e) => setSimulatorType(e.target.value)}>
                                {SIMULATOR_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Simulator Code</label>
                            <textarea className="form-control" rows="5" value={simulatorValue} onChange={handleSimulatorChange} />
                        </div>
                    </div>
                )}

                {selectedContentType === "video" && (
                    <div className="form-group">
                        <label>Video File</label>
                        <input type="file" className="form-control" accept="video/*" onChange={handleVideoFileChange} />
                        {videoUploadLoading && <p>Uploading video...</p>}
                    </div>
                )}

                {selectedContentType === "asset" && (
                    <div className="form-group">
                        <label>Asset File</label>
                        <input type="file" className="form-control" accept="*" onChange={handleAssetFileChange} />
                        {assetUploadLoading && <p>Uploading asset...</p>}
                    </div>
                )}

                {selectedContentType === "quiz" && (
                    <div>
                        <div className="form-group">
                            <label>Quiz Question</label>
                            <input type="text" className="form-control" value={quizQuestion} onChange={handleQuizQuestionChange} />
                        </div>
                        <label>Quiz Options</label>
                        {quizOptions.map((option, index) => (
                            <div key={index} className="form-group">
                                <select
                                    className="form-control"
                                    value={option.type}
                                    onChange={(e) => handleQuizOptionTypeChange(index, e)}
                                >
                                    <option value="text">Text</option>
                                    <option value="image">Image</option>
                                </select>
                                {option.type === "text" ? (
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Option ${index + 1}`}
                                        value={option.value}
                                        onChange={(e) => handleQuizOptionChange(index, e)}
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => handleQuizOptionChange(index, e)}
                                    />
                                )}
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={option.isCorrect}
                                        onChange={() => handleQuizOptionCorrectChange(index)}
                                    />
                                    Correct Answer
                                </label>
                            </div>
                        ))}
                    </div>
                )}

                <button className="default-btn" onClick={editContent ? handleUpdateContentClick : handleAddContentClick}>
                    {editContent ? "Update Content" : "Add Content"}
                </button>
                <button className="default-btn" onClick={handleAddPage}>
                    Add Page
                </button>
            </div>

            <div className="course-content-display">
                {Object.keys(Metabox).map((page) => (
                    <div key={page} className="page-content">
                        <h4>Page {page}</h4>
                        {Metabox[page].map((content, index) => (
                            <div key={index} className="content-item" style={{ marginBottom: "20px" }}>
                                {renderContent(content)}
                                <button className="default-btn" onClick={() => handleEditContent(content)} style={{ marginRight: "10px" }}>
                                    Edit
                                </button>
                                <button className="default-btn delete-btn" onClick={() => handleDeleteContent(content.pageNumber, content.contentType)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
};

export default CourseUpdateForm;