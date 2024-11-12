import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditForm = () => {
  const { id } = useParams(); // Extract the form ID from the URL
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    sections: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the form data when the component is mounted
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await axios.get(
          `https://form-builder-backend-eui0.onrender.com/forms/${id}`
        );
        setForm(response.data);
        setFormData({
          title: response.data.title,
          sections: response.data.sections,
        });
      } catch (error) {
        console.error("Error fetching form:", error);
      }
    };

    fetchForm();
  }, [id]);

  const handleFieldChange = (sectionIndex, fieldIndex, value) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].fields[fieldIndex].value = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(
        `https://form-builder-backend-eui0.onrender.com/forms/${id}`,
        formData
      );
      alert("Form updated successfully!");
      navigate(`/form/${id}`); // Redirect to the form page after saving
    } catch (error) {
      console.error("Error updating form:", error);
      alert("Failed to update form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-5">
      {form ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Edit Form: {form.title}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2">
                Form Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="input-field p-2 w-full border rounded-md"
              />
            </div>

            {formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="form-section mb-6">
                <h3 className="text-xl font-semibold">{section.label}</h3>
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="form-group mb-4">
                    <label htmlFor={field.label} className="block mb-2">
                      {field.label}
                    </label>

                    {field.type === "text" && (
                      <input
                        type="text"
                        id={field.label}
                        value={field.value || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            sectionIndex,
                            fieldIndex,
                            e.target.value
                          )
                        }
                        className="input-field p-2 w-full border rounded-md"
                      />
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        id={field.label}
                        value={field.value || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            sectionIndex,
                            fieldIndex,
                            e.target.value
                          )
                        }
                        className="input-field p-2 w-full border rounded-md"
                      />
                    )}

                    {field.type === "number" && (
                      <input
                        type="number"
                        id={field.label}
                        value={field.value || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            sectionIndex,
                            fieldIndex,
                            e.target.value
                          )
                        }
                        className="input-field p-2 w-full border rounded-md"
                      />
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        id={field.label}
                        value={field.value || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            sectionIndex,
                            fieldIndex,
                            e.target.value
                          )
                        }
                        className="input-field p-2 w-full border rounded-md"
                      />
                    )}

                    {field.type === "checkbox" && (
                      <div className="checkbox-group">
                        {field.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="checkbox-option">
                            <input
                              type="checkbox"
                              id={`${field.label}-${optionIndex}`}
                              value={option}
                              onChange={(e) => {
                                const currentValues = field.value || [];
                                if (e.target.checked) {
                                  handleFieldChange(sectionIndex, fieldIndex, [
                                    ...currentValues,
                                    option,
                                  ]);
                                } else {
                                  handleFieldChange(
                                    sectionIndex,
                                    fieldIndex,
                                    currentValues.filter(
                                      (item) => item !== option
                                    )
                                  );
                                }
                              }}
                              checked={field.value?.includes(option) || false}
                              className="mr-2"
                            />
                            <label htmlFor={`${field.label}-${optionIndex}`}>
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {field.type === "radio" && (
                      <div className="radio-group">
                        {field.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="radio-option">
                            <input
                              type="radio"
                              id={`${field.label}-${optionIndex}`}
                              name={field.label}
                              value={option}
                              onChange={(e) =>
                                handleFieldChange(
                                  sectionIndex,
                                  fieldIndex,
                                  e.target.value
                                )
                              }
                              checked={field.value === option}
                              className="mr-2"
                            />
                            <label htmlFor={`${field.label}-${optionIndex}`}>
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}

                    {field.type === "dropdown" && (
                      <select
                        id={field.label}
                        value={field.value || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            sectionIndex,
                            fieldIndex,
                            e.target.value
                          )
                        }
                        className="input-field p-2 w-full border rounded-md"
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            ))}

            <button
              type="submit"
              className="submit-button bg-blue-500 text-white p-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </>
      ) : (
        <p>Loading form...</p>
      )}
    </div>
  );
};

export default EditForm;
