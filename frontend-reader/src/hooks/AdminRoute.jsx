import { Navigate } from 'react-router-dom';
import useAuth from './useAuth';
import PropTypes from 'prop-types';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // If the authentication is still loading
    if (loading) {
        return <div>Loading...</div>;
    }

    // If the user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }

    // If the user doesn't have the admin role, redirect to "not authorized" page
    if (user.role !== 'ADMIN') {
        return <Navigate to="/na" replace />;
    }

    // If the user is an admin, render the children (protected content)
    return children;
};

AdminRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AdminRoute;
