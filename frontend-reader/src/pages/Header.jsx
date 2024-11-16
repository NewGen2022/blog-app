import '../styles/header.css';

const Header = () => {
    return (
        <div id="header">
            <a id="headerLeftPart">
                Inc&Code
                <img id="headerIcon" src="../../public/quill.png" />
            </a>

            <div id="headerRightPart">
                <div id="headerLoginStatus">Not logged in</div>
                <div id="headerAuthActions">
                    <a>Log In</a>
                    <a>Register</a>
                </div>
            </div>
        </div>
    );
};

export default Header;
