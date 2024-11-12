import React from "react";
import { motion } from "framer-motion";

const FormElement = ({ field, addOption }) => {
  const renderField = () => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Text input"
          />
        );
      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Checkbox option</span>
          </div>
        );
      case "radio":
        return (
          <div className="flex items-center">
            <input type="radio" className="form-radio h-5 w-5 text-blue-600" />
            <span className="ml-2 text-gray-700">Radio option</span>
          </div>
        );
      case "file":
        return <input type="file" className="w-full p-2 border rounded-md" />;
      case "dropdown":
        return (
          <select className="w-full p-2 border rounded-md">
            <option>Select an option</option>
            {field.options.map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
        );
      case "date":
        return <input type="date" className="w-full p-2 border rounded-md" />;
      case "textarea":
        return (
          <textarea
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Enter text here"
          ></textarea>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-2">
      {renderField()}
      {(field.type === "dropdown" ||
        field.type === "radio" ||
        field.type === "checkbox") && (
        <div className="mt-2">
          <input
            type="text"
            onKeyPress={addOption}
            placeholder="Add option and press Enter"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          {field.options.length > 0 && (
            <div className="mt-2 space-y-1">
              {field.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center bg-gray-100 p-2 rounded-md"
                >
                  <span className="text-sm text-gray-600">{option}</span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormElement;
