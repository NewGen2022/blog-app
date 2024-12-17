import '../styles/rightNavBar.css';
import PropTypes from 'prop-types';

const RightNavBar = ({ user }) => {
    return (
        <>
            <div id="right-nav-bar">RIGHT NAVBAR</div>
        </>
    );
};

RightNavBar.propTypes = {
    user: PropTypes.shape({
        role: PropTypes.string.isRequired,
    }),
};

export default RightNavBar;
