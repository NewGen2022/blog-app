import { useEffect, useState } from 'react';
import Layout from './layouts/Layout';
import axios from 'axios';
import { formatDate } from '../js/Date';
import '../styles/posts/posts.css';
import AlertMessage from './layouts/AlertMessage';

const Posts = () => {
    const [draftCards, setDraftCards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:2020/api/posts/all')
            .then((response) => {
                setDraftCards(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setErrors(
                    'An error occurred while fetching posts. Please try again later.'
                );
                setLoading(false);
            });
    }, []);

    return (
        <Layout>
            <div id="main-blog">
                {loading ? (
                    <div className="loading"></div>
                ) : errors ? (
                    <AlertMessage message={errors} type="error" />
                ) : draftCards && draftCards.length > 0 ? (
                    draftCards.map((card) => (
                        <a
                            key={card.id}
                            href={`/post/${card.id}`}
                            className="post"
                        >
                            <div className="post-updatedAt">
                                {formatDate(card.updatedAt)}
                            </div>

                            <h2 className="post-title">{card.name}</h2>

                            <div
                                className="post-content"
                                dangerouslySetInnerHTML={{
                                    __html: card.content,
                                }}
                            ></div>

                            <div className="bottom-post-container">
                                <div className="post-comment">
                                    {card._count.comment} 🗨️
                                </div>

                                <a className="read-more">Read more →</a>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="no-posts">No posts yet</div>
                )}
            </div>
        </Layout>
    );
};

export default Posts;
