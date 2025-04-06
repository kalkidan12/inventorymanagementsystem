import React from "react";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";

const BlogNotFound = () => {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Not Found</h1>
      <p className="text-gray-600 mb-6">
        The blog post you arere looking for does nott exist.
      </p>
      <button
        className="flex items-center justify-center bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
        onClick={() => router.push("/blogs")}
      >
        {" "}
        <FaArrowLeft className="mr-2" />
        Go Back to Blogs
      </button>
    </div>
  );
};

export default BlogNotFound;
