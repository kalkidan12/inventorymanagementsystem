import { motion } from "framer-motion";
import { FaCheckCircle, FaChartLine, FaShieldAlt } from "react-icons/fa";

const features = [
  {
    icon: FaCheckCircle,
    title: "Real-Time Stock Tracking",
    description: "Stay informed with up-to-date inventory levels and movement.",
  },
  {
    icon: FaChartLine,
    title: "Sales & Analytics Reports",
    description:
      "Gain insights with detailed reports and trends for smarter decisions.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Data & Role Management",
    description:
      "Protect your data and control access with powerful user permissions.",
  },
];

const WhyChooseUs = () => {
  return (
    <section
      id="why-choose-us"
      className="py-20 px-6 bg-gradient-to-br from-gray-100 to-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center mb-14"
      >
        <h2 className="text-4xl font-extrabold text-gray-800">
          Why Choose <span className="text-[#0F4C75]">Our System</span>?
        </h2>
        <p className="text-lg text-gray-600 mt-4">
          Built to empower businesses with intelligent, secure, and simple
          inventory control.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-200 hover:shadow-xl transition-all h-full flex flex-col justify-between"
          >
            <div className="mb-6">
              <Icon className="text-[#0F4C75] text-5xl mb-4 mx-auto animate-pulse" />
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <p className="text-gray-600 mt-2 text-sm">{description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
