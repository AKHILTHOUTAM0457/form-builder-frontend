import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const FormList = () => {
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/forms");
        setForms(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching forms:", error);
        setError("Failed to fetch forms. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-5 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-5 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Forms</h1>
        <Link
          to="/form-builder"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create New Form
        </Link>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700">Recent Forms</h2>

      {forms.length === 0 ? (
        <p className="text-gray-500">No forms created yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {form.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Created: {new Date(form.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <Link
                    to={`/form/${form._id}/`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition duration-300 ease-in-out"
                  >
                    Preview
                  </Link>
                  <Link
                    to={`/form/${form._id}/responses`}
                    className="text-green-600 hover:text-green-800 font-medium transition duration-300 ease-in-out"
                  >
                    View Responses
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormList;
