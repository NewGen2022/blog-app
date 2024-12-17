import { Route, Routes } from 'react-router-dom';
import DraftPosts from './DraftPosts';
import EditPost from './EditPost';
import CreatePost from './CreatePost';
import Post from '../Post';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="/draft" element={<DraftPosts />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/edit/:postId" element={<EditPost />} />
            <Route path="/:postId" element={<Post />} />
        </Routes>
    );
};

export default AdminRoutes;
