'use client';
import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FaUserPlus } from "react-icons/fa";
import PostList from '../../../components/PostList';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const CreatePost = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is not authenticated, redirect to login page
  if (status === "loading") {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (!session) {
    router.push('/login'); // Replace with your login page route
    return null;
  }

  return (
    <>
      <Navbar />
      <section className="relative bg-cover bg-center py-8 px-4" style={{ backgroundImage: `url('../../assign.jpg')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Assigner un Utilisateur à un Poste</h2>
            <span className="text-5xl mb-4">
              <FaUserPlus />
            </span>
            <Link
  href="inventaire/AddPost"
  prefetch={true} // Enable prefetching
  className="inline-block rounded-md bg-black px-4 py-2 border border-gray-500 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
>
  Ajouter Un Poste
</Link>
          </div>
        </div>
      </section>
      <section className="relative z-10">
        <PostList />
      </section>
    </>
  );
};

export default CreatePost;
