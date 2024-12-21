import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import Layout from '../layouts/Layout';
import '../../styles/posts/createPost.css';
import AlertMessage from '../layouts/AlertMessage';
import useAuth from '../../hooks/useAuth';
import useAlert from '../../hooks/useAlert';
import axios from 'axios';

const tinymceKey = import.meta.env.VITE_TINY_MCE_API_KEY;

const EditPost = () => {
    const { postId } = useParams();
    const editorRef = useRef(null);
    const { user } = useAuth();
    const { successMessage, setSuccessMessage, errorMessage, setErrorMessage } =
        useAlert();

    const [title, setTitle] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const [newTag, setNewTag] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Fetch the existing post data
    useEffect(() => {
        axios
            .get(`http://localhost:2020/api/posts/${postId}`)
            .then((response) => {
                const { name, content, postTag } = response.data;

                // Transforming postTag into an array of tag names
                const tagNames = postTag
                    ? postTag.map((tag) => tag.tag.name)
                    : [];

                setTitle(name);
                setEditorContent(content);
                setSelectedTags(tagNames); // Set tag names as the selected tags
                if (editorRef.current) {
                    editorRef.current.setContent(content);
                }
            })
            .catch(() => {
                setErrorMessage('Error fetching post details. Try later.');
            });
    }, [postId]);

    // Update post function
    const handlePostUpdate = async (status = 'PUBLISHED') => {
        if (user) {
            try {
                // Validate title and content
                if (!title || !editorContent) {
                    setErrorMessage(
                        'Both title and content are required to update the post.'
                    );
                    return;
                }

                // Ensure tags is an array
                if (!Array.isArray(selectedTags)) {
                    setErrorMessage(
                        'Tags must be a non-empty array and cannot contain invalid values.'
                    );
                    return;
                }

                // Make the API call to update the post
                const response = await axios.put(
                    `http://localhost:2020/api/posts/${postId}`,
                    {
                        name: title,
                        content: editorContent,
                        tags: selectedTags,
                        status: status,
                    }
                );

                if (response.status === 200) {
                    setSuccessMessage(
                        status === 'PUBLISHED'
                            ? 'Post published successfully!'
                            : 'Post saved as draft successfully!'
                    );
                }
            } catch (err) {
                setErrorMessage('Error updating post. Try later!');
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
            await handlePostUpdate();
        } else if (action === 'save') {
            await handlePostUpdate('DRAFT');
        }
    };

    return (
        <Layout>
            <div className="create-post-container">
                <AlertMessage message={successMessage} type="success" />
                <AlertMessage message={errorMessage} type="error" />

                <h1 className="create-post-title">Edit Post</h1>

                <form className="create-post-form" onSubmit={handleSubmit}>
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
                                onChange={(e) => setNewTag(e.target.value)}
                            />
                            <button
                                type="button"
                                className="add-tag-button"
                                onClick={() => {
                                    if (
                                        newTag &&
                                        !selectedTags.includes(newTag)
                                    ) {
                                        setSelectedTags([
                                            ...selectedTags,
                                            newTag,
                                        ]);
                                        setNewTag('');
                                    }
                                }}
                            >
                                + Add Tag
                            </button>
                        </div>
                        <div className="selected-tags">
                            {selectedTags.map((tag, index) => (
                                <span key={index} className="tag">
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        className="remove-tag"
                                        onClick={() =>
                                            setSelectedTags(
                                                selectedTags.filter(
                                                    (t) => t !== tag
                                                )
                                            )
                                        }
                                    >
                                        X
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

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
                            value={editorContent}
                            onEditorChange={(content) =>
                                setEditorContent(content)
                            }
                        />
                    </div>

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

export default EditPost;
