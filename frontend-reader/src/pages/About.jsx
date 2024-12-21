import Layout from './layouts/Layout';
import '../styles/about.css';

const About = () => {
    return (
        <Layout>
            <div id="main-blog">
                <div className="about-section">
                    <h1>About This Project</h1>
                    <p>
                        This project involves building a{' '}
                        <strong>RESTful API</strong> for a blog with front-end:
                        one for public viewing and commenting on posts, and the
                        other for admin post creation and management.
                    </p>
                    <p>
                        The backend, built with <strong>Express.js</strong> and{' '}
                        <strong>Prisma</strong>, handles blog posts, comments,
                        and user authentication using <strong>JWT</strong> for
                        secure access. Posts can be published or drafted, and
                        comments can be managed by the author.
                    </p>
                    <p>
                        The front-end consists of:
                        <ul>
                            <li>
                                A <strong>public site</strong> for readers to
                                view and comment on posts.
                            </li>
                            <li>
                                An <strong>admin dashboard</strong> for authors
                                to create, edit, and manage posts and comments.
                            </li>
                        </ul>
                    </p>
                    <p>
                        The project demonstrates the benefits of a decoupled
                        architecture, with separate backend and frontend
                        applications that can scale, be maintained, and secured
                        independently.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default About;
