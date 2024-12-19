import PropTypes from 'prop-types';
import '../../styles/alertMessage.css';

const AlertMessage = ({ message, type }) => {
    if (!message) return null;

    const messageClass = type === 'error' ? 'error' : 'success';

    return <div className={`message ${messageClass}`}>{message}</div>;
};

AlertMessage.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error']).isRequired,
};

export default AlertMessage;
