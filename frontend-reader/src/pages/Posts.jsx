import axios from 'axios';
import { useEffect, useState } from 'react';
import Layout from './layouts/Layout';

const Posts = () => {
    const [cards, setCards] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:2020/api/posts/all')
            .then((response) => {
                setCards(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setErrors(err);
                setLoading(false);
            });
    }, []);

    return (
        <Layout>
            <div id="main-blog">{console.log(cards)}</div>
        </Layout>
    );
};

export default Posts;
