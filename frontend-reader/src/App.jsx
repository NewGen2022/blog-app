import './styles/App.css';
import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './pages/auth/AuthRoutes';
import MainRoutes from './pages/main/mainRoutes';

function App() {
    return (
        <Routes>
            <Route path="/auth/*" element={<AuthRoutes />} />
            <Route path="/*" element={<MainRoutes />} />
        </Routes>
    );
}

export default App;
