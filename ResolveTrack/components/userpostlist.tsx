'use client';
import React, { useState, useEffect } from "react";
import { getSession } from 'next-auth/react';
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { AiOutlineEdit } from "react-icons/ai";


export interface Post {
  _id: string;
  email: string;
  title: string;
  fullname: string;
  centre: string;
  bureau: string;
  content?: string; // Optional field for post content
  date?: string; // Optional field for post date
  image?: string; // Optional field for additional image
  authorImage?: string; // Optional field for author image
}

const UserPostList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({});
  const [authorImageFiles, setAuthorImageFiles] = useState<{ [key: string]: File | null }>({});
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUserPosts = async () => {
      const session = await getSession(); // Fetch authenticated session

      if (!session?.user) {
        // Redirect or handle unauthenticated user
        console.error('User is not authenticated.');
        return;
      }

      try {
        const response = await fetch(`/api/display`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data.filter((post: Post) => post.email === session?.user?.email));
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseDetails = () => {
    setSelectedPost(null);
  };

  const handleImageChange = (postId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFiles((prev) => ({ ...prev, [postId]: file }));
      // Optionally upload the image to the server here
    }
  };

  const handleAuthorImageChange = (postId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAuthorImageFiles((prev) => ({ ...prev, [postId]: file }));
      // Optionally upload the image to the server here
    }
  };

  const handleChangePictureClick = (postId: string) => {
    const fileInput = document.querySelector<HTMLInputElement>(`input[type='file'][data-postid='${postId}']`);
    fileInput?.click();
  };

  const handleChangeAuthorImageClick = (postId: string) => {
    const fileInput = document.querySelector<HTMLInputElement>(`input[type='file'][data-author-postid='${postId}']`);
    fileInput?.click();
  };

 
  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-6">
        {/* Post Cards */}
        <div className="flex-1 max-w-s"> {/* Reduced width */}
          {posts.map((post) => (
            <div key={post._id} className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
              <div className="relative h-32 overflow-hidden">
                <img 
                  className="object-cover object-center w-full h-full" 
                  src={imageFiles[post._id] ? URL.createObjectURL(imageFiles[post._id]!) : post.image || '/logo.jpg'} 
                  alt='Post' 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(event) => handleImageChange(post._id, event)} 
                  className="absolute bottom-2 right-2 opacity-0 file-input"
                  data-postid={post._id} // Add data-postid attribute
                />
                <button 
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none"
                  onClick={() => handleChangePictureClick(post._id)}
                >
                  <AiOutlineEdit className="h-6 w-6" />
                </button>
              </div>
              <div className="relative -mt-16 mx-auto w-32 h-32 border-4 border-white rounded-full overflow-hidden">
                <img 
                  className="object-cover object-center h-full w-full" 
                  src={authorImageFiles[post._id] ? URL.createObjectURL(authorImageFiles[post._id]!) : post.authorImage || '/profile.jpg'} 
                  alt='Author' 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(event) => handleAuthorImageChange(post._id, event)} 
                  className="absolute bottom-2 right-2 opacity-0 file-input"
                  data-author-postid={post._id} // Add data-author-postid attribute
                />
                <button 
                  className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg focus:outline-none"
                  onClick={() => handleChangeAuthorImageClick(post._id)}
                >
                  <AiOutlineEdit className="h-6 w-6" />
                </button>
              </div>
              <div className="text-center mt-2 p-4">
                <h2 className="font-semibold text-lg">{post.title}</h2>
                <p className="text-gray-500">{post.fullname}</p>
                <p className="text-gray-700">{post.email}</p>
                <p className="text-gray-600 mt-2">{post.content}</p> {/* Display post content */}
                <p className="text-gray-400 text-sm">{post.date}</p> {/* Display post date */}
              </div>
              <div className="p-4 border-t mx-4 mt-2 flex justify-between items-center">
                <button 
                  onClick={() => handlePostClick(post)}
                  className="w-full rounded-full bg-gray-900 hover:bg-gray-800 font-semibold text-white px-6 py-2"
                >
                   Details
                </button>
               
              </div>
            </div>
          ))}
        </div>

        {/* Additional Images */}
        <div className="flex flex-col gap-4">
          <Link href="/dashboard/editerprofile">
            <div className="relative">
              <img
                src="/editprofile.jpg"
                alt="Edit Profile"
                className="rounded-lg border-2 border-black hover:border-yellow-600 hover:scale-105 transition-transform duration-300"
                style={{ width: "450px", height: "180px", marginTop: "20px" }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                Editer Profile
              </div>
            </div>
          </Link>
          <Link href="/dashboard/voirmateriel">
            <div className="relative">
              <img
                src="/materiel.jpg"
                alt="Material"
                className="rounded-lg border-2 border-black hover:border-yellow-600 hover:scale-105 transition-transform duration-300"
                style={{ width: "450px", height: "180px" }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50">
                Voir Materiel
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Display selected post details */}
      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-lg mx-auto">
            <h2 className="text-xl font-semibold mb-4">{selectedPost.title}</h2>
            <p><strong>Email:</strong> {selectedPost.email}</p>
            <p><strong>Nom Complet:</strong> {selectedPost.fullname}</p>
            <p><strong>Centre:</strong> {selectedPost.centre}</p>
            <p><strong>Bureau:</strong> {selectedPost.bureau}</p>
            <p className="mt-2">{selectedPost.content}</p> {/* Display detailed content */}
            <button
              onClick={handleCloseDetails}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPostList;
