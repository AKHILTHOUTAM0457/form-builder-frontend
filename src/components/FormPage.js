"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Loader2, AlertCircle, CheckCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FormPage() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [files, setFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `https://form-builder-backend-eui0.onrender.com/forms/${id}`
        );
        setForm(response.data);
      } catch (error) {
        console.error("Error fetching form:", error);
        setSubmitStatus({
          type: "error",
          message: "Failed to load form. Please try again.",
        });
      }
    };

    fetchForm();
  }, [id]);

  const handleInputChange = (e, field) => {
    setResponses((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({
        ...prev,
        [field]: e.target.files[0],
      }));
    }
  };

  const handleCheckboxChange = (e, field, option) => {
    setResponses((prev) => {
      const currentValues = prev[field] || [];
      if (e.target.checked) {
        return { ...prev, [field]: [...currentValues, option] };
      } else {
        return {
          ...prev,
          [field]: currentValues.filter((value) => value !== option),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData();
    formData.append(
      "responses",
      JSON.stringify(
        Object.entries(responses).map(([label, response]) => ({
          label,
          response: Array.isArray(response) ? response.join(", ") : response,
        }))
      )
    );

    Object.entries(files).forEach(([field, file]) => {
      formData.append(field, file);
    });

    try {
      await axios.post(
        `https://form-builder-backend-eui0.onrender.com/api/forms/${id}/submit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSubmitStatus({
        type: "success",
        message: "Form submitted successfully!",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              {form.title}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              {form.sections.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                  className="space-y-6 bg-gray-50 p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.label}
                  </h3>
                  {section.fields.map((field, fieldIndex) => (
                    <motion.div
                      key={fieldIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: fieldIndex * 0.05 }}
                      className="space-y-2"
                    >
                      <label
                        htmlFor={field.label}
                        className="block text-sm font-medium text-gray-700"
                      >
                        {field.label}
                      </label>

                      {field.type === "text" && (
                        <input
                          type="text"
                          id={field.label}
                          value={responses[field.label] || ""}
                          onChange={(e) => handleInputChange(e, field.label)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          id={field.label}
                          value={responses[field.label] || ""}
                          onChange={(e) => handleInputChange(e, field.label)}
                          rows={4}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}

                      {field.type === "number" && (
                        <input
                          type="number"
                          id={field.label}
                          value={responses[field.label] || ""}
                          onChange={(e) => handleInputChange(e, field.label)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}

                      {field.type === "date" && (
                        <input
                          type="date"
                          id={field.label}
                          value={responses[field.label] || ""}
                          onChange={(e) => handleInputChange(e, field.label)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      )}

                      {field.type === "checkbox" && field.options && (
                        <div className="mt-2 space-y-2">
                          {field.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                id={`${field.label}-${optionIndex}`}
                                value={option}
                                onChange={(e) =>
                                  handleCheckboxChange(e, field.label, option)
                                }
                                checked={(
                                  responses[field.label] || []
                                ).includes(option)}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200 ease-in-out cursor-pointer"
                              />
                              <label
                                htmlFor={`${field.label}-${optionIndex}`}
                                className="ml-3 block text-sm text-gray-700 cursor-pointer select-none"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      {field.type === "radio" && field.options && (
                        <div className="mt-2 space-y-2">
                          {field.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className="flex items-center"
                            >
                              <input
                                type="radio"
                                id={`${field.label}-${optionIndex}`}
                                name={field.label}
                                value={option}
                                onChange={(e) =>
                                  handleInputChange(e, field.label)
                                }
                                checked={responses[field.label] === option}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 transition-all duration-200 ease-in-out cursor-pointer"
                              />
                              <label
                                htmlFor={`${field.label}-${optionIndex}`}
                                className="ml-3 block text-sm text-gray-700 cursor-pointer select-none"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}

                      {field.type === "dropdown" && field.options && (
                        <div className="mt-1 relative">
                          <select
                            id={field.label}
                            value={responses[field.label] || ""}
                            onChange={(e) => handleInputChange(e, field.label)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md appearance-none bg-white cursor-pointer transition-all duration-200 ease-in-out"
                          >
                            <option value="">Select an option</option>
                            {field.options.map((option, optionIndex) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                      )}

                      {field.type === "file" && (
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors duration-200 ease-in-out">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor={field.label}
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id={field.label}
                                  name={field.label}
                                  type="file"
                                  className="sr-only"
                                  onChange={(e) =>
                                    handleFileChange(e, field.label)
                                  }
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              ))}

              <div className="pt-5">
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 ease-in-out"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      "Submit"
                    )}
                  </motion.button>
                </div>
              </div>
            </form>

            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 p-4 rounded-md ${
                    submitStatus.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {submitStatus.type === "success" ? (
                        <CheckCircle
                          className="h-5 w-5 text-green-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <AlertCircle
                          className="h-5 w-5 text-red-400"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium">
                        {submitStatus.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
