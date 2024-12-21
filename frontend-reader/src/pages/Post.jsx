import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from './layouts/Layout';
import AlertMessage from './layouts/AlertMessage';
import '../styles/posts/post.css';
import useAuth from '../hooks/useAuth';

const Post = () => {
    const { user } = useAuth();
    const { postId } = useParams(); // Extracting postId from the URL
    const [post, setPost] = useState(null); // To store the post data
    const [comments, setComments] = useState([]); // To store comments related to the post
    const [newComment, setNewComment] = useState(''); // To store new comment input
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    // Fetch the post details
    useEffect(() => {
        axios
            .get(`http://localhost:2020/api/posts/${postId}`)
            .then((response) => {
                const { name, content, tags, author, createdAt, comments } =
                    response.data;
                setPost({ name, content, tags, author, createdAt });
                setComments(comments || []);
            })
            .catch(() => {
                setErrorMessage('Error fetching post details. Try later.');
            });
    }, [postId]);

    // Fetch comments for the post
    useEffect(() => {
        if (!isLoadingComments) {
            setIsLoadingComments(true);
            axios
                .get(`http://localhost:2020/api/posts/${postId}/comments`)
                .then((response) => {
                    setComments(response.data || []);
                })
                .catch(() => {
                    setErrorMessage('Error fetching comments. Try later.');
                })
                .finally(() => {
                    setIsLoadingComments(false);
                });
        }
    }, [postId, isLoadingComments]);

    // Handle comment submission
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) {
            setErrorMessage('Comment cannot be empty!');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:2020/api/posts/${postId}/comment`,
                { content: newComment, authorId: user.id }
            );
            setComments([response.data, ...comments]); // Prepend new comment
            setNewComment('');
            setSuccessMessage('Comment added successfully!');
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    return (
        <Layout>
            <div id="main-blog">
                <div className="post-details-container">
                    {errorMessage && (
                        <AlertMessage message={errorMessage} type="error" />
                    )}
                    {successMessage && (
                        <AlertMessage message={successMessage} type="success" />
                    )}

                    {post ? (
                        <>
                            <div className="post-header-container">
                                <h1 className="post-header">{post.name}</h1>
                                <div className="author-info">
                                    <p>By {user.username}</p>
                                    <p>
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="tags-container">
                                {post.tags && (
                                    <ul>
                                        {post.tags.map((tag, index) => (
                                            <li key={index}>{tag}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div
                                className="post-content"
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            ></div>

                            <div className="comments-section">
                                <h2>Comments</h2>
                                <form onSubmit={handleCommentSubmit}>
                                    <div className="form-group">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) =>
                                                setNewComment(e.target.value)
                                            }
                                            placeholder="Write a comment..."
                                            rows="4"
                                            className="form-input"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="submit-button"
                                    >
                                        Add Comment
                                    </button>
                                </form>

                                {comments.length === 0 ? (
                                    <p>
                                        No comments yet. Be the first to
                                        comment!
                                    </p>
                                ) : (
                                    <div className="comments-list">
                                        {comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="comment"
                                            >
                                                <p className="comment-text">
                                                    {comment.text}
                                                </p>
                                                <small className="comment-time">
                                                    Posted on:{' '}
                                                    {new Date(
                                                        comment.createdAt
                                                    ).toLocaleString()}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <p>Loading post details...</p>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Post;
