"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#" },
  { name: "FAQs", href: "#" },
  { name: "Contact", href: "#" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-indigo-100 via-purple-100 to-white min-h-screen">
      <header className=" fixed inset-x-0 top-0 z-50bg-gradient-to-b from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border-b border-gray-100">
        <nav
          aria-label="Global"
          className="container mx-auto flex items-center justify-between p-4 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="/" className="flex items-center space-x-2">
              <img
                alt="ChatConnect Logo"
                src="https://res.cloudinary.com/dpdejfl2k/image/upload/v1733116676/txjkwonfikizve3ljwe4.png"
                className="h-10 w-auto"
              />
              <span className="font-semibold text-xl text-gray-800">
                ChatConnect
              </span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Login button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a
              href="/login"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Log in
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </nav>

        {/* Mobile menu */}
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-lg">
            {/* Mobile menu content */}
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <a href="/" className="flex items-center space-x-2">
                    <img
                      alt="ChatConnect Logo"
                      src="https://res.cloudinary.com/dpdejfl2k/image/upload/v1733116676/txjkwonfikizve3ljwe4.png"
                      className="h-8 w-auto"
                    />
                  </a>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full p-2 text-gray-700 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block py-3 text-base font-medium text-gray-900 hover:text-indigo-600"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100">
                <a
                  href="/login"
                  className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Log in
                </a>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      {/* Hero section */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              New: Real-time chatting experience
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connect and Chat Instantly
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Experience seamless communication with real-time private
              messaging, friend requests, and activity notifications—all in one
              place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/login"
                className="w-full sm:w-auto rounded-xl bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Start Chatting
              </a>
              <a
                href="/under-construction"
                className="w-full sm:w-auto rounded-xl bg-gray-50 px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                Learn more
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
