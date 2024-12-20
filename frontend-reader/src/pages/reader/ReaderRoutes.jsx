import { Route, Routes } from 'react-router-dom';
import Posts from '../Posts';
import Home from '../Home';
import Post from '../Post';
import About from '../About';
import NotAuth from '../NotAuth';

const MainRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all" element={<Posts />} />
            <Route path="/about" element={<About />} />
            <Route path="/na" element={<NotAuth />} />
            <Route path="/post/:postId" element={<Post />} />
        </Routes>
    );
};

export default MainRoutes;
