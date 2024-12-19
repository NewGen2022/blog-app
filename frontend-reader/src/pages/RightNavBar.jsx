import PropTypes from 'prop-types';
import { useState } from 'react';
import '../styles/posts/modal.css';
import AlertMessage from './layouts/AlertMessage';
import useAlert from '../hooks/useAlert';
import axios from 'axios';

const RightNavBar = ({ user }) => {
    const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } =
        useAlert();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tagName, setTagName] = useState('');

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

    return (
        <>
            <div id="right-nav-bar">
                <div id="search-container">
                    <h3>Search</h3>
                    <input id="search-container" type="search" />
                </div>
                {user && user.role === 'ADMIN' ? (
                    <>
                        <a href="/admin/create" id="create-post-link">
                            Create post
                        </a>
                        <button id="add-tag-btn" onClick={handleModelOpen}>
                            Add tag
                        </button>
                    </>
                ) : (
                    ''
                )}

                <div>All tags</div>
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
