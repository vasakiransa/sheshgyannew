import baseUrl from "@/utils/baseUrl";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CourseAsset = ({ id: courseId, vertical = false, onAssetSelect }) => {
    const [assets, setAssets] = useState([]);
    const [currentAssetIndex, setCurrentAssetIndex] = useState(0); // Track current asset index
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true); // Set loading to true before fetching
            const url = `${baseUrl}/api/assets/${courseId}`;
            try {
                const response = await axios.get(url);
                setAssets(response.data.assets);
            } catch (error) {
                console.error("Error fetching assets:", error);
                // Consider setting an error state here to display an error message to the user
            } finally {
                setLoading(false); // Set loading to false after fetching, whether success or error
            }
        };

        fetchAssets();
    }, [courseId]);

    // Function to handle asset click
    const handleAssetClick = (asset) => {
        if (asset.type === 'image') {
            console.log("Selecting image:", asset.lecture_file); // Log the image URL
            onAssetSelect(asset.lecture_file); // Call the function to set the image in Player
        } else {
            window.open(asset.lecture_file, '_blank'); // Open other types in a new tab
        }
    };

    // Navigation functions
    const handleNextAsset = () => {
        if (currentAssetIndex < assets.length - 1) {
            setCurrentAssetIndex(currentAssetIndex + 1);
        }
    };

    const handlePreviousAsset = () => {
        if (currentAssetIndex > 0) {
            setCurrentAssetIndex(currentAssetIndex - 1);
        }
    };

    return (
        <div className="course-assets">
            <div className="card shadow-lg rounded-lg p-5 bg-light">
                <div className="d-flex align-items-center mb-4">
                    <div className="icon-wrapper mr-3">
                        <i className="bx bx-folder-open bx-sm" style={{ fontSize: '1.5rem', color: '#5e72e4' }}></i>
                    </div>
                    <h4 className="card-title mb-0">Course Resources</h4>
                </div>

                {loading ? (
                    <div className="text-center">Loading resources...</div>
                ) : assets.length > 0 ? (
                    <div className="asset-display text-center">
                        {/* Display current asset */}
                        {assets[currentAssetIndex].type === 'image' ? (
                            <img
                                src={assets[currentAssetIndex].lecture_file}
                                alt={assets[currentAssetIndex].lecture_name}
                                className="img-fluid mb-3"
                            />
                        ) : (
                            <p>Preview not available for this asset type.</p>
                        )}
                        <h6 className="font-weight-bold">{assets[currentAssetIndex].lecture_name}</h6>
                        <p className="text-muted mb-3">Click the button below to view.</p>

                        <button
                            className="btn btn-primary mt-3"
                            onClick={() => handleAssetClick(assets[currentAssetIndex])}
                        >
                            View Asset
                        </button>

                        {/* Navigation buttons */}
                        <div className="navigation-buttons mt-3">
                            <button
                                className="btn btn-secondary mr-2"
                                onClick={handlePreviousAsset}
                                disabled={currentAssetIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={handleNextAsset}
                                disabled={currentAssetIndex === assets.length - 1}
                            >
                                Next
                            </button>
                        </div>
                         {/* Asset Counter */}
                         <p className="mt-2 text-muted">
                            Asset {currentAssetIndex + 1} of {assets.length}
                        </p>
                    </div>
                ) : (
                    <div className="col-12 text-center">
                        <p className="text-muted">No resources available for this course yet.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
				.asset-display img {
					max-width: 100%;
					border-radius: 10px;
				}

				.navigation-buttons button {
					margin: 5px;
				}

				.btn-primary {
					background-color: #5e72e4;
					color: white;
					border-radius: 5px;
					padding: 10px 20px;
					font-weight: bold;
					border: none;
					cursor: pointer;
				}

				.btn-primary:hover {
					background-color: #42529f;
				}

				.btn-secondary {
					background-color: #6c757d;
					color: white;
					border-radius: 5px;
				}

				.btn-secondary:hover {
					background-color: #5a6268;
				}
			`}</style>
        </div>
    );
};

export default CourseAsset;
