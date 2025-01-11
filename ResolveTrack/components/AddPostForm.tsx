"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { GiDesk } from "react-icons/gi";

const AddPostForm = () => {
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/login");
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch("/api/emails");
        if (res.ok) {
          const data = await res.json();
          setEmails(data); // Assuming data is an array of emails
        } else {
          toast.error("Failed to fetch emails");
        }
      } catch (error) {
        toast.error("Error fetching emails");
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, []);

  const checkExistingPost = async (centre: string, bureau: string) => {
    const res = await fetch(`/api/posts?centre=${centre}&bureau=${bureau}`);
    if (res.ok) {
      const data = await res.json();
      return data.exists;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const fullname = (form.elements.namedItem("fullname") as HTMLInputElement).value;
    const centre = (form.elements.namedItem("centre") as HTMLInputElement).value;
    const bureau = (form.elements.namedItem("bureau") as HTMLInputElement).value;
  
    if (!selectedEmail) {
      setError("Email is required");
      toast.error("Email is required");
      return;
    }
  
    if (!title || title.trim() === "") {
      setError("Title is required");
      toast.error("Title is required");
      return;
    }
  
    const exists = await checkExistingPost(centre || "", bureau || "");
    if (exists) {
      setError("A post with this centre and bureau already exists");
      toast.error("A post with this centre and bureau already exists");
      return;
    }
  
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedEmail,
          title,
          fullname,
          centre,
          bureau,
        }),
      });
  
      if (res.status === 400) {
        toast.error("Email not found or title already exists");
        setError("Email not found or title already exists");
        return;
      }
  
      if (res.ok) {
        setError("");
        toast.success("Post created successfully");
        router.push("/admin/inventaire/");
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("Error, try again");
      console.error("API request error:", error);
    }
  };
  
  
  if (sessionStatus === "loading") {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (!session?.user || session.user.email !== 'admin@gmail.com') {
    router.push('/'); // Redirect to homepage if not admin
    return <p>Access Denied</p>; // Show access denied message
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-full py-6 sm:px-6 lg:px-8">
        <div className="w-full lg:w-3/4 flex flex-col lg:flex-row">
          {/* Video Section */}
          <div className="lg:w-1/2 lg:pr-8 relative mb-8 lg:mb-0">
            <video autoPlay loop muted className="w-full h-full object-cover">
              <source src="/posteajout.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Form Section */}
          <div className="flex flex-col justify-center w-full lg:w-1/2">
            <div className="flex justify-center flex-col items-center">
              <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
                Ajouter utilisateur a un Poste
              </h2>
              <GiDesk className="text-6xl text-yellow-600 mt-2" />
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <select
                        id="email"
                        name="email"
                        value={selectedEmail}
                        onChange={(e) => setSelectedEmail(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>
                          Selectionner un email
                        </option>
                        {emails.map((email) => (
                          <option key={email} value={email}>
                            {email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Titre du Poste
                    </label>
                    <div className="mt-2">
                      <input
                        id="title"
                        name="title"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="fullname"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nom Complet
                    </label>
                    <div className="mt-2">
                      <input
                        id="fullname"
                        name="fullname"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="centre"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Centre
                    </label>
                    <div className="mt-2">
                      <input
                        id="centre"
                        name="centre"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="bureau"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Bureau
                    </label>
                    <div className="mt-2">
                      <input
                        id="bureau"
                        name="bureau"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="rounded-md bg-black px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Ajouter Poste
                    </button>
                  </div>
                </form>

                {error && (
                  <p className="text-red-600 text-center text-[16px] my-4">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPostForm;
