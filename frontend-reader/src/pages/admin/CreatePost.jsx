import { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Layout from '../layouts/Layout';
import '../../styles/posts/createPost.css';
import AlertMessage from '../layouts/AlertMessage';
import useAuth from '../../hooks/useAuth';
import useAlert from '../../hooks/useAlert';
import axios from 'axios';

const tinymceKey = import.meta.env.VITE_TINY_MCE_API_KEY;

const CreatePost = () => {
    const editorRef = useRef(null); // Ref for the TinyMCE Editor

    const { user } = useAuth();
    const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } =
        useAlert();

    const [title, setTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [newTag, setNewTag] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // creating post
    const handlePostAdding = async (status = 'PUBLISHED') => {
        if (user) {
            try {
                // if no title - display error message
                if (!title) {
                    setErrorMessage('Please provide title for the post.');
                    return;
                }
                // if no post content - display error message
                if (!editorContent) {
                    setErrorMessage('Please provide the post content.');
                    return;
                }

                // make a POST request for creating a post
                const response = await axios.post(
                    'http://localhost:2020/api/posts/',
                    {
                        name: title,
                        content: editorContent,
                        postStatus: status,
                        authorId: user.id,
                        tags: selectedTags,
                    }
                );

                // if success - clear all variables and display success message
                if (response.status === 201) {
                    setSuccessMessage(
                        status === 'PUBLISHED'
                            ? 'Post published successfully!'
                            : 'Post saved successfully!'
                    );
                    setTitle('');
                    setEditorContent('');
                    setErrorMessage('');
                    setNewTag('');
                    setSelectedTags([]);

                    if (editorRef.current) {
                        editorRef.current.setContent(''); // Clear editor content
                    }
                }
            } catch (err) {
                setErrorMessage('Error saving post. Try later!');
                setSuccessMessage('');
                console.error(err);
            }
        } else {
            setErrorMessage('User not authenticated');
        }
    };

    // submitting form that is responsible for post creation
    const handleSubmit = async (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.name;

        if (action === 'publish') {
            await handlePostAdding();
        } else if (action === 'save') {
            await handlePostAdding('DRAFT');
        }
    };

    // tracking editor content
    const handleEditorChange = (content) => {
        setEditorContent(content);
    };

    // tracking tag change for adding as post tag in the future
    const handleTagInputChange = (e) => {
        setNewTag(e.target.value);
    };

    // adding tag that is related to post
    const handleAddTag = () => {
        if (newTag && !selectedTags.includes(newTag)) {
            setSelectedTags([...selectedTags, newTag]);
            setNewTag('');
        }
    };

    // deleting tag that is related to post
    const handleRemoveTag = (tag) => {
        setSelectedTags(selectedTags.filter((item) => item !== tag));
    };

    return (
        <Layout>
            <div className="create-post-container">
                <AlertMessage message={successMessage} type="success" />
                <AlertMessage message={errorMessage} type="error" />

                <h1 className="create-post-title">Create Post</h1>

                <form className="create-post-form" onSubmit={handleSubmit}>
                    {/* Title container */}
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            id="title"
                            className="form-input"
                            placeholder="Enter the post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Container for adding tags to a post */}
                    <div className="form-group">
                        <label htmlFor="tags" className="form-label">
                            Tags
                        </label>
                        <div className="tags-input-container">
                            <input
                                type="text"
                                id="tags"
                                className="form-input"
                                placeholder="Enter a tag"
                                value={newTag}
                                onChange={handleTagInputChange}
                            />
                            <button
                                type="button"
                                className="add-tag-button"
                                onClick={handleAddTag}
                            >
                                + Add Tag
                            </button>
                        </div>

                        {/* Display selected tags */}
                        <div className="selected-tags">
                            {selectedTags.map((tag, index) => (
                                <span key={index} className="tag">
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        className="remove-tag"
                                        onClick={() => handleRemoveTag(tag)}
                                    >
                                        X
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Post content container */}
                    <div className="form-group">
                        <label htmlFor="content" className="form-label">
                            Content
                        </label>
                        <Editor
                            id="editor"
                            apiKey={tinymceKey}
                            onInit={(evt, editor) =>
                                (editorRef.current = editor)
                            }
                            initialValue="<p>Remove this text and write your post here...</p>"
                            init={{
                                height: 400,
                                menubar: true,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount',
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </div>

                    {/* Buttons for publishing/saving (draft) a post */}
                    <div className="form-group-btns">
                        <button
                            type="submit"
                            name="publish"
                            className="submit-button"
                        >
                            Publish Post
                        </button>
                        <button
                            type="submit"
                            name="save"
                            className="save-button"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreatePost;
