import React, { useState, useEffect } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import EditPostForm from "./EditpostForm";
import toast from "react-hot-toast";

export interface Post {
  _id: string;
  email: string;
  title: string;
  fullname: string;
  centre: string;
  bureau: string;
}

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/display");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleEdit = (post: Post) => {
    setSelectedPost(post);
    setIsEditing(true);
  };
  const handleSave = async (updatedPost: Post) => {
    try {
      const userResponse = await fetch("/api/emails");
      if (!userResponse.ok) throw new Error("Failed to fetch User emails");
  
      const userData = await userResponse.json();
      const existingEmails = userData;
  
      if (!existingEmails.includes(updatedPost.email)) {
        toast.error("Email does not exist in User database");
        throw new Error("Email does not exist in User database");
      }
  
      const response = await fetch(`/api/edit/${updatedPost._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newemail: updatedPost.email,
          newtitle: updatedPost.title,
          newfullname: updatedPost.fullname,
          newcentre: updatedPost.centre,
          newbureau: updatedPost.bureau
        }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Post updated successfully on the server:", result.updatedPost);
  
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === updatedPost._id ? updatedPost : post
          )
        );
        setIsEditing(false);
        setSelectedPost(null);
        toast.success("Post updated successfully");
      } else {
        throw new Error(`Failed to update post with ID: ${updatedPost._id}`);
      }
    } catch (error) {
      console.error("Error updating post with ID:", updatedPost._id, error);
      toast.error("Error updating post");
    }
  };
  

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPost(null);
  };

  const handleDelete = async (postId: string) => {
    try {
      const response = await fetch(`/api/delete/deletepost?id=${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
        setSelectedPost(null);
      } else {
        console.error(`Failed to delete post with ID: ${postId}`);
        toast.error("Failed to delete post");
      }
    } catch (error) {
      console.error(`Error deleting post with ID: ${postId}`, error);
      toast.error("Error deleting post");
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDetails = () => {
    setSelectedPost(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 text-center">{error}</p>;
  }

  return (
    <div className="relative p-6 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Postes</h1>

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Chercher par Titre ou Email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 w-full max-w-md border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ca8a04] focus:border-transparent"
        />
      </div>

      <table className="w-full border-collapse mb-4 bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-[#fef08a] text-black">
            <th className="p-3 text-left">Titre</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Nom Complet</th>
            <th className="p-3 text-left">Centre</th>
            <th className="p-3 text-left">Bureau</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post, index) => (
            <tr
              key={post._id}
              className={`border-b cursor-pointer ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
              onClick={() => handlePostClick(post)}
            >
              <td className="p-3">{post.title}</td>
              <td className="p-3">{post.email}</td>
              <td className="p-3">{post.fullname}</td>
              <td className="p-3">{post.centre}</td>
              <td className="p-3">{post.bureau}</td>
              <td className="p-3 flex space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(post);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <AiOutlineEdit className="text-2xl" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post._id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete className="text-2xl" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPost && !isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">{selectedPost.title}</h2>
              <p><strong>Email:</strong> {selectedPost.email}</p>
              <p><strong>Nom Complet:</strong> {selectedPost.fullname}</p>
              <p><strong>Centre:</strong> {selectedPost.centre}</p>
              <p><strong>Bureau:</strong> {selectedPost.bureau}</p>
              <button
                onClick={handleCloseDetails}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPost && isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <EditPostForm
              post={selectedPost}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;
