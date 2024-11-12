import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const FormResponses = () => {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedResponses, setExpandedResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(
          `https://form-builder-backend-eui0.onrender.com/api/forms/${id}/responses`
        );
        setResponses(response.data.responses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching responses:", error);
        setError("Failed to load responses. Please try again.");
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [id]);

  const toggleResponseExpansion = (index) => {
    setExpandedResponses((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center text-red-500 mb-4">
            <AlertCircle className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          Responses for Form {id}
        </h2>
        {responses.length > 0 ? (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden shadow rounded-lg cursor-pointer"
                onClick={() => toggleResponseExpansion(index)}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Response {index + 1}
                    </h3>
                    <button className="text-blue-600 hover:text-blue-800 focus:outline-none focus:underline transition ease-in-out duration-150">
                      {expandedResponses.includes(index) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {expandedResponses.includes(index) && (
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      {response.responses.map((resp, respIndex) => (
                        <div key={respIndex} className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            {resp.label}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {resp.response || "N/A"}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No responses
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                No responses have been submitted for this form yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormResponses;
