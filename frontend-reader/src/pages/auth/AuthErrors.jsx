import PropTypes from 'prop-types';

const AuthErrors = ({ errors }) => {
    return (
        <div className="authErrors">
            {errors &&
                errors.map((error, index) => <p key={index}>{error.msg}</p>)}
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
