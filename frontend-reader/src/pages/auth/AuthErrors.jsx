import PropTypes from 'prop-types';

const AuthErrors = ({ errors }) => {
    return (
        <div id="registerErrors" className="authErrors">
            {errors &&
                errors.map((error, index) => (
                    <div key={index}>{error.msg}</div>
                ))}
        </div>
    );
};

AuthErrors.propTypes = {
    errors: PropTypes.arrayOf(
        PropTypes.shape({
            msg: PropTypes.string.isRequired, // The error message must be a string
        })
    ).isRequired, // `errors` is a required prop
};

export default AuthErrors;
