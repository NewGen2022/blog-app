import PropTypes from 'prop-types';

const RightNavBar = ({ user }) => {
    return (
        <>
            <div id="right-nav-bar">
                <div id="search-container">
                    <h3>Search</h3>
                    <input id="search-container" type="search" />
                </div>
                {user && user.role === 'ADMIN' ? (
                    <>
                        <a href="/admin/create" id="create-post-link">
                            Create post
                        </a>
                        <button id="add-tag-btn">Add tag</button>
                    </>
                ) : (
                    ''
                )}

                <div>All tags</div>
            </div>
        </>
    );
};

RightNavBar.propTypes = {
    user: PropTypes.shape({
        role: PropTypes.string.isRequired,
    }),
};

export default RightNavBar;
