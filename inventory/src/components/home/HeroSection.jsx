import Link from "next/link";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-r from-[#0F172A] to-[#0F4C75] text-white py-24 px-6 overflow-hidden"
    >
      {/* Background Decorative Blurs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ x: -150, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 2 }}
          className="absolute w-[600px] h-[600px] bg-yellow-400 rounded-full opacity-10 blur-3xl top-[-200px] left-[-200px]"
        />
        <motion.div
          initial={{ x: 150, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute w-[400px] h-[400px] bg-white rounded-full opacity-10 blur-2xl bottom-[-100px] right-[-100px]"
        />
      </div>

      {/* Main Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Take Control of Your{" "}
          <span className="text-yellow-400">Inventory</span>
        </h1>
        <p className="text-lg md:text-xl mt-4 text-gray-200 max-w-2xl mx-auto">
          Smart, simple, and powerful inventory management tailored for modern
          businesses.
        </p>

        <motion.div whileHover={{ scale: 1.07 }} className="mt-8 inline-block">
          <Link
            href="/auth/signup"
            className="bg-yellow-400 text-[#0F172A] px-8 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-yellow-300 transition-all"
          >
            Start Free Trial
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
