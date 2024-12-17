import PropTypes from 'prop-types';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <>
            <Header />

            <div id="main">{children}</div>
        </>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
