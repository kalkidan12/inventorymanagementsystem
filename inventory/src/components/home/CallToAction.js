import Link from "next/link";
import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section
      id="call-to-action"
      className="py-20 px-6 bg-gradient-to-br from-[#0F172A] to-[#0F4C75] text-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-4xl font-extrabold">
          Ready to Take Control of Your Inventory?
        </h2>
        <p className="text-lg text-gray-200 mt-4">
          Start your free trial now and discover the power of smart inventory
          management.
        </p>
        <motion.div whileHover={{ scale: 1.08 }} className="mt-8 inline-block">
          <Link
            href="/auth/signup"
            className="bg-[#F8D210] text-[#0F172A] px-8 py-3 rounded-xl font-bold text-lg shadow hover:bg-yellow-400 transition-all"
          >
            Start Free Trial
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CallToAction;
