import React, { useState } from "react";
import { Post } from "./PostList";

interface EditPostFormProps {
  post: Post;
  onSave: (updatedPost: Post) => void;
  onCancel: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  post,
  onSave,
  onCancel,
}) => {
  const [updatedPost, setUpdatedPost] = useState<Post>({ ...post });

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof Post
  ) => {
    setUpdatedPost({
      ...updatedPost,
      [field]: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(updatedPost);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Titre:
          <input
            type="text"
            value={updatedPost.title}
            onChange={(e) => handleInputChange(e, "title")}
            required
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Email:
          <input
            type="email"
            value={updatedPost.email}
            onChange={(e) => handleInputChange(e, "email")}
            required
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Nom Complet:
          <input
            type="text"
            value={updatedPost.fullname}
            onChange={(e) => handleInputChange(e, "fullname")}
            required
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Centre:
          <input
            type="text"
            value={updatedPost.centre}
            onChange={(e) => handleInputChange(e, "centre")}
            required
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Bureau:
          <input
            type="text"
            value={updatedPost.bureau}
            onChange={(e) => handleInputChange(e, "bureau")}
            required
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          type="submit"
          style={{
            backgroundColor: "#008000",
            color: "#ffffff",
            padding: "10px 20px",
            marginRight: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: "#ff0000",
            color: "#ffffff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditPostForm;
