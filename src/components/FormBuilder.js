"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Share2 } from "lucide-react";

// Assuming these components are defined in separate files
import Sidebar from "./Sidebar";
import FormArea from "./FormArea";

export default function FormBuilder() {
  const [formName, setFormName] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [shareLink, setShareLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formName || formFields.length === 0) {
      alert("Please provide a form name and add at least one field.");
      return;
    }

    setIsSubmitting(true);

    const formData = {
      title: formName,
      sections: [
        {
          label: "Main Section",
          fields: formFields,
        },
      ],
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/forms",
        formData
      );

      if (response.status === 201) {
        const formId = response.data._id;
        const shareResponse = await axios.post(
          `http://localhost:5000/api/forms/${formId}/share`
        );
        setShareLink(shareResponse.data.formLink);
      }
    } catch (error) {
      console.error("Error creating form:", error);
      alert("Failed to create form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Form Builder
            </h1>
            <div className="mb-6">
              <label
                htmlFor="formName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Form Name
              </label>
              <input
                type="text"
                id="formName"
                placeholder="Enter form name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Sidebar setFormFields={setFormFields} />
              <FormArea formFields={formFields} setFormFields={setFormFields} />
            </div>
            <div className="mt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Saving...
                  </span>
                ) : (
                  "Save and Send Form"
                )}
              </motion.button>
            </div>
          </div>
          {shareLink && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-green-50 p-6 mt-6 rounded-b-xl"
            >
              <div className="flex items-center justify-center space-x-2 text-green-700 mb-3">
                <Share2 size={24} />
                <h2 className="text-xl font-semibold">Share Your Form</h2>
              </div>
              <p className="text-center text-green-600 mb-4">
                Your form has been created successfully. Use the link below to
                share it:
              </p>
              <div className="flex justify-center">
                <a
                  href={shareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white text-blue-600 rounded-md shadow hover:bg-blue-50 transition duration-300 flex items-center space-x-2"
                >
                  <span>{shareLink}</span>
                  <Share2 size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DndProvider>
  );
}
