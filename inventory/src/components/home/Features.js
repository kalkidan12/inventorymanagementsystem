import { motion } from "framer-motion";
import { MdOutlineInventory, MdOutlineSupportAgent } from "react-icons/md";
import { FaBox } from "react-icons/fa";

const features = [
  {
    icon: MdOutlineInventory,
    title: "Inventory Tracking",
    description:
      "Monitor stock levels in real time with precision and clarity.",
  },
  {
    icon: FaBox,
    title: "Product & Order Management",
    description:
      "Easily manage products, categories, and customer orders from one place.",
  },
  {
    icon: MdOutlineSupportAgent,
    title: "24/7 Customer Support",
    description: "Get expert help anytime you need it, day or night.",
  },
];

const Features = () => {
  return (
    <section
      id="powerful-features"
      className="py-20 px-6 bg-gradient-to-br from-white to-gray-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center mb-14"
      >
        <h2 className="text-4xl font-extrabold text-gray-800">
          Powerful <span className="text-[#0F4C75]">Features</span>
        </h2>
        <p className="text-lg text-gray-600 mt-4">
          Everything you need to streamline your operations and boost
          efficiency.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map(({ icon: Icon, title, description }, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg p-8 h-full flex flex-col text-center justify-between"
          >
            <div>
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

export default Features;
