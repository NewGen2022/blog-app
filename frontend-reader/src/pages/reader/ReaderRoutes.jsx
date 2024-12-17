import { Route, Routes } from 'react-router-dom';
import Posts from '../Posts';
import Home from '../Home';
import Post from '../Post';
import About from '../About';
import Latest from '../Latest';
import NotAuth from '../NotAuth';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all" element={<Posts />} />
            <Route path="/latest" element={<Latest />} />
            <Route path="/about" element={<About />} />
            <Route path="/na" element={<NotAuth />} />
            <Route path="/:postId" element={<Post />} />
        </Routes>
    );
};

export default MainRoutes;
