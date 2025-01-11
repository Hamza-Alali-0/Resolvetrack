"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import NavbarSign from "@/components/NavbarSign";
import { SiGnuprivacyguard } from "react-icons/si";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
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
    const confirmPassword = e.target[2].value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords are not equal");
      toast.error("Passwords are not equal");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        toast.error("This email is already registered");
        setError("The email is already in use");
      }
      if (res.status === 200) {
        setError("");
        toast.success("Registration successful");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("Error, try again");
      console.log(error);
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
                src="/signup.jpg" // Update this path to the location of your image
                alt="Sign In Graphic"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Form Section */}
            <div className="lg:w-1/2 bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12 flex flex-col items-center">
              <div className="flex flex-col items-center">
                <h2 className="mt-1 text-center text-2xl leading-9 tracking-tight text-gray-900">
                  Sign Up
                </h2>
                <SiGnuprivacyguard className="mt-2 text-3xl" />
              </div>
              <form className="mt-6 space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
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
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm password
                  </label>
                  <div className="mt-2">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full border border-black justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Sign up
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
      )}
    </>
  );
};

export default RegisterPage;
