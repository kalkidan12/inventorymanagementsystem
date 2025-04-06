import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const AuthNavbar = () => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="sticky top-0 bg-gradient-to-r from-[#0F172A] to-[#0F4C75] shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
        {/* Company Logo */}
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-extrabold text-[#F8D210] tracking-tight"
        >
          Kaliget
        </Link>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 flex-1 justify-end">
          <li>
            <Link
              href="/#home"
              className="text-[#F8D210] hover:text-white transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/#services"
              className="text-[#F8D210] hover:text-white transition duration-300"
            >
              Our Services
            </Link>
          </li>
          <li>
            <Link
              href="/#about"
              className="text-[#F8D210] hover:text-white transition duration-300"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className="text-[#F8D210] hover:text-white transition duration-300"
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/#contact"
              className="text-[#F8D210] hover:text-white transition duration-300"
            >
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? (
              <FaTimes size={24} color="#F8D210" />
            ) : (
              <FaBars size={24} color="#F8D210" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-[#0F172A] space-y-4 transition-all duration-500 ease-in-out ${
          navOpen ? "max-h-screen opacity-100 py-4" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <ul className="p-6">
          <li>
            <Link
              href="/#home"
              className="text-[#F8D210] hover:text-white transition duration-300 block py-2"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/#services"
              className="text-[#F8D210] hover:text-white transition duration-300 block py-2"
            >
              Our Services
            </Link>
          </li>
          <li>
            <Link
              href="/#about"
              className="text-[#F8D210] hover:text-white transition duration-300 block py-2"
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/blogs"
              className="text-[#F8D210] hover:text-white transition duration-300 block py-2"
            >
              Blogs
            </Link>
          </li>
          <li>
            <Link
              href="/#contact"
              className="text-[#F8D210] hover:text-white transition duration-300 block py-2"
            >
              Contact Us
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AuthNavbar;
