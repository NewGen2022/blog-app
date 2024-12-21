import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import '../styles/posts/modal.css';
import AlertMessage from './layouts/AlertMessage';
import useAlert from '../hooks/useAlert';
import axios from 'axios';

const RightNavBar = ({ user }) => {
    const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } =
        useAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tagName, setTagName] = useState('');
    const [tags, setTags] = useState([]); // State to hold all tags
    const [loadingTags, setLoadingTags] = useState(true); // State to handle loading
    const [selectedTags, setSelectedTags] = useState([]); // State for selected tags (filter)

    // Fetch tags from the server
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:2020/api/posts/tags'
                ); // Assuming this is the endpoint for tags
                setTags(response.data); // Set tags data
            } catch (err) {
                setErrorMessage('Error fetching tags. Please try again later.');
                console.error(err);
            } finally {
                setLoadingTags(false); // Stop loading after the request
            }
        };

        fetchTags();
    }, []);

    const handleModelOpen = () => {
        setIsModalOpen((prev) => !prev);
    };

    const handleSaveTag = async () => {
        if (!tagName.trim()) {
            setErrorMessage('Tag name is required');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:2020/api/posts/tag',
                {
                    tagName,
                }
            );

            if (response.status === 201) {
                setSuccessMessage('Tag created successfully!');
                setTagName('');
                setErrorMessage('');
                setTags((prevTags) => [...prevTags, { name: tagName }]); // Add new tag to state
            }
        } catch (err) {
            if (
                err.response.status === 400 &&
                err.response.data.message === 'This tag already exists'
            ) {
                setErrorMessage('This tag already exists');
            } else {
                setErrorMessage('Error adding tag. Try later!');
            }
            setSuccessMessage('');
            console.error(err);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTagName('');
        setErrorMessage('');
        setSuccessMessage('');
    };

    // Handle tag selection for filtering
    const toggleTagSelection = (tag) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tag)
                ? prevSelectedTags.filter((selectedTag) => selectedTag !== tag)
                : [...prevSelectedTags, tag]
        );
    };

    return (
        <>
            <div id="right-nav-bar">
                <div id="search-container">
                    <h3>Search</h3>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Search post here..."
                    />
                </div>

                {user && user.role === 'ADMIN' ? (
                    <div id="create-add-container">
                        <a href="/admin/create" id="create-post-link">
                            Create post
                        </a>
                        <button id="add-tag-btn" onClick={handleModelOpen}>
                            Add tag
                        </button>
                    </div>
                ) : (
                    ''
                )}

                <div>
                    <h3>All Tags</h3>
                    {loadingTags ? (
                        <p>Loading tags...</p>
                    ) : tags.length > 0 ? (
                        <div id="tags-container">
                            {tags.map((tag, index) => (
                                <button
                                    key={index}
                                    className={`tag-btn ${
                                        selectedTags.includes(tag.name)
                                            ? 'selected'
                                            : ''
                                    }`}
                                    onClick={() => toggleTagSelection(tag.name)}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div>No tags available</div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <>
                    <AlertMessage message={successMessage} type="success" />
                    <AlertMessage message={errorMessage} type="error" />

                    <div
                        id="add-tag-modal"
                        className="modal-overlay"
                        onClick={handleCloseModal}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>Add Tag</h3>
                            <input
                                type="text"
                                placeholder="Enter tag name"
                                id="tag-input"
                                value={tagName}
                                onChange={(e) => setTagName(e.target.value)}
                                required
                            />
                            <div className="modal-actions">
                                <button
                                    type="submit"
                                    id="submit-tag-add"
                                    onClick={handleSaveTag}
                                >
                                    Add
                                </button>
                                <button
                                    id="cancel-tag-add"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

RightNavBar.propTypes = {
    user: PropTypes.shape({
        role: PropTypes.string.isRequired,
    }),
};

export default RightNavBar;
