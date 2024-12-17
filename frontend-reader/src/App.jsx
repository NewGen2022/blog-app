import './styles/App.css';
import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './pages/auth/AuthRoutes';
import ReaderRoutes from './pages/reader/ReaderRoutes';
import AdminRoutes from './pages/admin/AdminRoutes';
import AdminRoute from './hooks/AdminRoute';

function App() {
    return (
        <Routes>
            <Route path="/auth/*" element={<AuthRoutes />} />

            <Route
                path="/admin/*"
                element={
                    <AdminRoute>
                        <AdminRoutes />
                    </AdminRoute>
                }
            />

            <Route path="/*" element={<ReaderRoutes />} />
        </Routes>
    );
}

export default App;
