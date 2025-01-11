'use client';
import React from "react";
import AddPostForm from "../../../../components/AddPostForm";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AddPost = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is not authenticated, redirect to login page
  if (status === "loading") {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (!session ) {
    router.push('/login'); 
    return null;
  }
  return (
    <div><AddPostForm /></div>
  )
}

export default AddPost
