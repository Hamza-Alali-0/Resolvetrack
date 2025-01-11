"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { Dialog } from "@headlessui/react";
import { FaBars, FaTimes } from "react-icons/fa";

const NavbarSign = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
  ];

  return (
    <>
      <header className="bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Plastima</span>
              <Image src="/logo.jpg" width={140} height={90} alt="Plastima logo" />
            </Link>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-yellow-600 hover:bg-gray-50 transition-colors duration-300 rounded-md px-3 py-2"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-end gap-x-6">
            {!session ? (
              <>
                <Link
                  href="/login"
                  className="hidden lg:block text-sm font-semibold leading-6 text-gray-900 hover:text-yellow-600"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-colors duration-300"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm font-medium text-gray-900">{session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-semibold leading-6 text-gray-900 hover:text-yellow-600"
                >
                  Log out
                </button>
              </>
            )}
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <FaBars className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </nav>

        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full max-w-sm bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Plastima</span>
                <Image width={140} height={60} src="/logo.jpg" alt="Plastima logo mobile" />
              </Link>
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <FaTimes className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md"
                >
                  {item.name}
                </Link>
              ))}
              {!session ? (
                <>
                  <Link
                    href="/login"
                    className="block rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-colors duration-300"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-colors duration-300"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => signOut()}
                  className="block w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 transition-colors duration-300"
                >
                  Log out
                </button>
              )}
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
    </>
  );
};

export default NavbarSign;
