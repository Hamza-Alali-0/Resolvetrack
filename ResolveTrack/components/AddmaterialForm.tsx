
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { PiDesktopTowerFill } from "react-icons/pi";

const AddPostForm = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
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
    const fetchTitles = async () => {
      try {
        const res = await fetch("/api/titles");
        if (res.ok) {
          const data = await res.json();
          const uniqueTitles = Array.from(new Set(data)) as string[];
          setTitles(uniqueTitles);
        } else {
          toast.error("Failed to fetch titles");
        }
      } catch (error) {
        toast.error("Error fetching titles");
        console.error("Error fetching titles:", error);
      }
    };

    fetchTitles();
  }, []);

  useEffect(() => {
    const fetchEmails = async () => {
      if (!selectedTitle) return;
      try {
        const res = await fetch(`/api/emailt?title=${selectedTitle}`);
        if (res.ok) {
          const data = await res.json();
          setEmails(data as string[]);
        } else {
          toast.error("Failed to fetch emails");
        }
      } catch (error) {
        toast.error("Error fetching emails");
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, [selectedTitle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const type = (form.elements.namedItem("type") as HTMLInputElement).value;
    const models = (form.elements.namedItem("models") as HTMLInputElement).value;
    const reference = (form.elements.namedItem("reference") as HTMLInputElement).value;
    const quantity = (form.elements.namedItem("quantity") as HTMLInputElement).value;

    if (!selectedEmail) {
      toast.error("Email is required");
      setError("Email is required");
      
      return;
    }

    try {
      const res = await fetch("/api/material", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: selectedEmail,
          type,
          models,
          reference,
          quantity,
        }),
      });

      if (res.status === 400) {
        toast.error("Email not found");
        setError("Email not found");
        return;
      }

      if (res.ok) { 
        toast.success("Material added successfully");
        setError("");
       
        router.push("/admin/dashboard/");
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


 
  if (!session) {
    router.push('/login');
    return null;
  }

  console.log("Rendered with titles:", titles);
  console.log("Selected title:", selectedTitle);
  console.log("Emails:", emails);
  console.log("Selected email:", selectedEmail);

  return (
    <>
      <div className="flex min-h-full flex-1 justify-center py-12 sm:px-6 lg:px-1">
        <div className="lg:w-1/2 lg:pl-8 relative">
          <video autoPlay loop muted className="w-full h-full object-cover">
            <source src="/poste.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="flex flex-col justify-center w-full lg:w-1/2 mt-8">
          <div className="flex justify-center flex-col items-center">
            <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
              Ajouter du Materiel
            </h2>
            <PiDesktopTowerFill className="text-6xl text-yellow-600 mt-2" />
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Selectionner titre
                </label>
                <div className="mt-2">
                  <select
                    id="title"
                    name="title"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="" disabled>
                      Selectionner un titre
                    </option>
                    {titles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedTitle && (
                <div className="mt-6">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Selectionner Email
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
              )}

              {selectedEmail && (
                <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Type
                    </label>
                    <div className="mt-2">
                      <select
                        id="type"
                        name="type"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="" disabled>
                          Selectionner type du poste
                        </option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="models"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Modele
                    </label>
                    <div className="mt-2">
                      <input
                        id="models"
                        name="models"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-1 focus:ring-inset focus:ring-indigo-600 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reference"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Reference
                    </label>
                    <div className="mt-2">
                      <input
                        id="reference"
                        name="reference"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-1 focus:ring-inset focus:ring-indigo-600 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Quantite
                    </label>
                    <div className="mt-2">
                      <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm focus:ring-1 focus:ring-inset focus:ring-indigo-600 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center mt-6">
                    <button
                      type="submit"
                      className="rounded-md bg-black px-3 py-2 border border-gray-500 border-1 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Ajouter Materiel
                    </button>
                  </div>
                </form>
              )}

              {error && (
                <p className="text-red-600 text-center text-[16px] my-4">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPostForm;
