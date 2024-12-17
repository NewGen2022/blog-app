import { Editor } from '@tinymce/tinymce-react';
import Layout from '../layouts/Layout';

const CreatePost = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e);
    };

    const handleEditorChange = (e) => {
        e.preventDefault();
        console.log(e);
    };

    return (
        <Layout>
            <div>
                <h1>Create post</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="title">Title</label>
                    <input id="title" />

                    <label htmlFor="content">Content</label>
                    <Editor
                        id="content"
                        apiKey="r2w6ta9v8uqj6cwc68od2gbxi9cv9qp2nqwzvcyouwynh3nu"
                        initialValue="<p>Write your post here...</p>"
                        init={{
                            height: 500,
                            menubar: false,
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
                </form>
            </div>
        </Layout>
    );
};

export default CreatePost;
