import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Why Choose Us", id: "why-choose-us" },
    { label: "Powerful Features", id: "powerful-features" },
    { label: "Contact Us", id: "contact-us" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-extrabold text-[#F8D210] tracking-tight"
        >
          Kaliget
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {navItems.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                className="text-[#F8D210] hover:text-white transition duration-300"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button
            aria-label="Toggle navigation menu"
            onClick={() => setNavOpen((prev) => !prev)}
          >
            {navOpen ? (
              <FaTimes size={24} className="text-[#F8D210]" />
            ) : (
              <FaBars size={24} className="text-[#F8D210]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      {navOpen && (
        <div className="md:hidden bg-[#0F172A] transition-all duration-300 py-4 px-6 space-y-4 text-center">
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="block w-full text-[#F8D210] text-base font-semibold hover:text-white transition"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
