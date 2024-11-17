import '../styles/header.css';

const Header = () => {
    return (
        <div id="header">
            <a id="headerLeftPart" href="/">
                Inc&Code
                <img id="headerIcon" src="../../public/quill.png" />
            </a>

            <div id="headerRightPart">
                <div id="headerLoginStatus">Not logged in</div>
                <div id="headerAuthActions">
                    <a href="/auth/login" id="headerLogin">
                        <img src="../../public/login.png" />
                        Log In
                    </a>
                    <a href="/auth/register" id="headerRegister">
                        <img src="../../public/register.png" />
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Header;
