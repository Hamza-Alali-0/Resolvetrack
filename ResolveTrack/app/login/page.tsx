"use client";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NavbarSign from "@/components/NavbarSign";
import { FaSignInAlt } from "react-icons/fa";

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/home");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      toast.error("Email is invalid");
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      toast.error("Password is invalid");
      setError("Password is invalid");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      toast.error("Invalid email or password");
    } else {
      setError("");
      toast.success("Successful login");
      if (res?.url) router.replace("/home");
    }
  };

  if (sessionStatus === "loading") {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  return (
    <>
      <NavbarSign />
      {sessionStatus !== "authenticated" && (
        <div className="flex min-h-screen items-start justify-center py-6 sm:py-12 lg:py-8">
          <div className="flex flex-col lg:flex-row items-stretch max-w-7xl w-full">
            {/* Image Section */}
            <div className="lg:w-1/2 flex justify-center items-center bg-gray-100">
              <img
                src="/identif.png" 
                alt="Sign In Graphic"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Form Section */}
            <div className="lg:w-1/2 bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12 flex flex-col items-center">
              <div className="flex flex-col items-center  mt-11">
                <h2 className="mt-1 text-center text-2xl leading-9 tracking-tight text-gray-900">
                  Sign In
                </h2>
                <FaSignInAlt className="mt-2 text-3xl" />
              </div>
              <form className="mt-6 space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email 
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Mot de Passe
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <div>
                <p className="text-red-600 text-center text-[16px] my-4">
                  {error && error}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
