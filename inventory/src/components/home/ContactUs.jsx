import Link from "next/link";
import React, { useState } from "react";
import {
  FaLinkedin,
  FaYoutube,
  FaTelegram,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage || !subject) {
      toast.error("Please fill out all fields before sending.", {
        position: "top-right",
      });
      return;
    }

    setIsSending(true);
    window.location.href = `mailto:kaligetservice@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(contactMessage)}%0A%0AFrom: ${contactEmail}`;

    setTimeout(() => {
      setIsSending(false);
      setContactEmail("");
      setContactMessage("");
      setSubject("");
      toast.success("Message sent successfully!", { position: "top-right" });
    }, 2000);
  };

  return (
    <section
      id="contact-us"
      className="bg-gray-900 text-white py-6 px-4 sm:px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Left: Contact Form */}
        <div className="flex-1 bg-white text-gray-900 p-8 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <p className="text-gray-600 mt-2">
              Have questions? Fill out the form and we’ll get back to you.
            </p>
            <form onSubmit={handleContactSubmit} className="space-y-6 mt-6">
              <input
                type="email"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Your Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                disabled={isSending}
              />
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSending}
              />
              <textarea
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
                placeholder="Your Message"
                rows="5"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                disabled={isSending}
              />
              <button
                type="submit"
                className={`w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg transition ${
                  isSending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "hover:bg-yellow-500"
                }`}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Info Section */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          {/* Quick Links */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-lg">
              {[
                { name: "Home", href: "/#home" },
                { name: "Why Choose Us", href: "/#why-choose-us" },
                { name: "Powerful Features", href: "/#powerful-features" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
              ].map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-yellow-400 hover:text-white transition"
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-4">
            <h3 className="text-2xl font-semibold mb-2">Contact Info</h3>
            <div className="flex items-center gap-3">
              <FaPhone className="text-yellow-400" />
              <span>+251 902 280 977</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-yellow-400" />
              <span>kaligetservice@gmail.com</span>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              <Link
                href="https://www.t.me/kaligets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-white transition"
              >
                <FaTelegram size={28} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/kalkidangetahun1203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-white transition"
              >
                <FaLinkedin size={28} />
              </Link>
              <Link
                href="https://www.youtube.com/@kaligets"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:text-white transition"
              >
                <FaYoutube size={28} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
        <p>
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>{" "}
          |{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()}{" "}
          <Link
            href="https://kaliget.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            kaliget.com
          </Link>
          . All rights reserved.
        </p>
      </div>

      <ToastContainer />
    </section>
  );
};

export default ContactUs;
