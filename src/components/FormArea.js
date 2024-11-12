import React from "react";
import { useDrop } from "react-dnd";
import { motion, AnimatePresence } from "framer-motion";
import FormElement from "./FormElement";
import { Plus } from "lucide-react";

const FormArea = ({ formFields, setFormFields }) => {
  const [, drop] = useDrop({
    accept: "FORM_ELEMENT",
    drop: (item) => addFormElement(item),
  });

  const addFormElement = (item) => {
    setFormFields([
      ...formFields,
      { type: item.type, label: item.label, options: [] },
    ]);
  };

  const handleLabelChange = (index, newLabel) => {
    const updatedFields = [...formFields];
    updatedFields[index].label = newLabel;
    setFormFields(updatedFields);
  };

  const addOption = (event, index, type) => {
    if (event.key === "Enter" && event.target.value) {
      const updatedFields = [...formFields];
      if (updatedFields[index].type === type) {
        updatedFields[index].options.push(event.target.value);
        setFormFields(updatedFields);
        event.target.value = "";
      }
    }
  };

  const removeField = (index) => {
    const updatedFields = formFields.filter((_, i) => i !== index);
    setFormFields(updatedFields);
  };

  return (
    <div className="form-area-container flex-1 ml-6">
      <div
        ref={drop}
        className="form-area p-6 bg-white rounded-lg shadow-md min-h-[500px] border-2 border-dashed border-blue-300 transition-all duration-300 hover:border-blue-500"
      >
        {formFields.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Plus size={48} className="mb-2" />
            <p className="text-lg">Drag and drop form elements here</p>
          </div>
        )}
        <AnimatePresence>
          {formFields.map((field, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="form-element mb-6 p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <button
                  onClick={() => removeField(index)}
                  className="ml-2 p-2 text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label="Remove field"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <FormElement
                field={field}
                handleLabelChange={(newLabel) =>
                  handleLabelChange(index, newLabel)
                }
                addOption={(event) => addOption(event, index, field.type)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FormArea;
