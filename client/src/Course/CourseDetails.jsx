import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import UploadNote from './UploadNote'; // Keeping the UploadNote component for file uploads
import axios from 'axios';
import { UserContext } from '../Context/UserContext';
import Sidebar from '../Components/Sidebar';

const CourseDetails = () => {
    const { courseId } = useParams();
    const [files, setFiles] = useState([]);
    const { user } = useContext(UserContext);

    // Fetch files from the backend
    const fetchFiles = async () => {
        try {
            console.log("Fetching files...");
            const response = await axios.get('http://localhost:3001/files'); // API route for fetching files
            if (response.data && Array.isArray(response.data)) {
                console.log("Fetched files:", response.data); // Debugging fetched data
                // Filter files by matching courseId
                const filteredFiles = response.data.filter(
                    (file) => file.metadata?.courseId === courseId
                );
                console.log("Filtered files:", filteredFiles);
                setFiles(filteredFiles);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [courseId]);

    // Callback to add a new file to the files state
    const addFile = (newFile) => {
        setFiles((prevFiles) => [...prevFiles, newFile]);
    };

    // Function to handle file download
    const downloadFile = (filename) => {
        const link = document.createElement('a');
        link.href = `http://localhost:3001/file/${filename}`;
        link.setAttribute('download', filename);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Function to handle file deletion
    const deleteFile = async (filename) => {
        try {
            await axios.delete(`http://localhost:3001/file/${filename}`);
            setFiles((prevFiles) => prevFiles.filter((file) => file.filename !== filename));
            console.log(`File ${filename} deleted successfully`);
        } catch (error) {
            console.error(`Error deleting file ${filename}:`, error);
        }
    };

    return (
        <div>
            <Sidebar />
            <div className="content">
                <div style={{ padding: '16px' }}>
                    <h1 style={{ fontSize: '50px', marginBottom: '16px' }}>Course {courseId}</h1>

                    <div>
                        <h1 style={{ marginTop: '32px', marginBottom: '16px' }}>Uploaded Notes</h1>
                        {files.length > 0 ? (
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '16px',
                                }}
                            >
                                {files.map((file, index) => {
                                    const { filename, metadata } = file || {};
                                    if (!filename) {
                                        console.warn("Invalid file data at index:", index, file);
                                        return null; // Skip invalid file entries
                                    }

                                    return (
                                        <div
                                            key={filename}
                                            style={{
                                                backgroundColor: '#ffffff',
                                                borderRadius: '8px',
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <img
                                                src={`http://localhost:3001/file/${filename}`} // File URL
                                                alt={filename}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto',
                                                    borderRadius: '4px',
                                                    marginBottom: '8px',
                                                }}
                                            />
                                            <p
                                                style={{
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '8px',
                                                }}
                                            >
                                                {filename}
                                                <br />
                                                Uploaded by: {metadata.uploader}
                                            </p>

                                            <button
                                                style={{
                                                    padding: '8px',
                                                    backgroundColor: '#4CAF50',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    width: '90px', 
                                                    height: '32px', 
                                                }}
                                                onClick={() => downloadFile(filename)}
                                            >
                                                Download
                                            </button>

                                            {user?.name === metadata.uploader && ( // Conditionally render the Delete button
                                                <button
                                                    style={{
                                                        padding: '8px 16px',
                                                        backgroundColor: '#FF5733', // Red color for delete
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        width: '90px', 
                                                        height: '32px', 
                                                        marginLeft: '8px',
                                                    }}
                                                    onClick={() => deleteFile(filename)} // Call delete function
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No files uploaded yet.</p>
                        )}
                    </div>
                    
                    <div style={{ marginTop: '64px' }}>

                        <h1>Upload Your Notes!</h1>
                        <UploadNote
                            courseId={courseId}
                            username={user?.name || "Guest"}
                            onUploadSuccess={addFile}
                        /> {/* Pass addFile as a prop */}

                        <button
                            style={{
                                marginTop: '16px',
                                padding: '10px 20px',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                            onClick={fetchFiles} // Trigger the fetchFiles function
                        >
                            Refresh Files
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
