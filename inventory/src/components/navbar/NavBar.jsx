import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";

const NavBar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { label: "Home", id: "home" },
    { label: "Why Choose Us", id: "why-choose-us" },
    { label: "Powerful Features", id: "powerful-features" },
    { label: "Contact Us", id: "contact-us" },
  ];

  const handleNavClick = (id) => {
    const navbarHeight = document.querySelector("nav")?.offsetHeight || 60;

    if (router.pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        const scrollTop =
          el.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
        window.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }

    setNavOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0F172A] shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl sm:text-3xl font-extrabold text-[#F8D210] tracking-tight"
        >
          Kaliget
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium">
          {navItems.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => handleNavClick(id)}
                className="text-[#F8D210] hover:text-white transition duration-300"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setNavOpen((prev) => !prev)}>
            {navOpen ? (
              <FaTimes size={24} className="text-[#F8D210]" />
            ) : (
              <FaBars size={24} className="text-[#F8D210]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {navOpen && (
        <div className="md:hidden bg-[#0F172A] px-4 pb-6 pt-2 animate-slideDown space-y-3">
          {navItems.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className="block w-full bg-[#1E293B] text-[#F8D210] text-base font-semibold rounded-lg py-3 hover:bg-[#334155] transition"
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Animation Style */}
      <style jsx>{`
        .animate-slideDown {
          animation: slideDown 0.25s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
      `}</style>
    </nav>
  );
};

export default NavBar;
