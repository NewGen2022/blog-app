import { Editor } from '@tinymce/tinymce-react';
import Layout from '../layouts/Layout';
import '../../styles/posts/createPost.css';

const CreatePost = () => {
    const handleSubmit = (e) => {
        e.preventDefault();

        // Determine which button was clicked
        const action = e.nativeEvent.submitter.name;

        if (action === 'publish') {
            console.log('Form submitted: Publish Post');
        } else if (action === 'save') {
            console.log('Form submitted: Save');
        }
    };

    const handleEditorChange = (content, editor) => {
        console.log('Editor Content:', content);
        console.log('Editor:', editor);
    };

    return (
        <Layout>
            <div className="create-post-container">
                <h1 className="create-post-title">Create Post</h1>
                <form className="create-post-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>
                        <input
                            id="title"
                            className="form-input"
                            placeholder="Enter the post title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content" className="form-label">
                            Content
                        </label>
                        <Editor
                            id="editor"
                            apiKey="r2w6ta9v8uqj6cwc68od2gbxi9cv9qp2nqwzvcyouwynh3nu"
                            initialValue="<p>Write your post here...</p>"
                            init={{
                                height: 400,
                                menubar: true,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount',
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help',
                            }}
                            onEditorChange={handleEditorChange}
                        />
                    </div>

                    <div className="form-group-btns">
                        <button
                            type="submit"
                            name="publish"
                            className="submit-button"
                        >
                            Publish Post
                        </button>

                        <button
                            type="submit"
                            name="save"
                            className="save-button"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreatePost;
