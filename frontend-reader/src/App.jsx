import './styles/App.css';
import { Route, Routes } from 'react-router-dom';
import AuthRoutes from './pages/auth/AuthRoutes';

function App() {
    return (
        <Routes>
            <Route path="/auth/*" element={<AuthRoutes />} />
        </Routes>
    );
}

export default App;
