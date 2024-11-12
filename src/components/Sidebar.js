import React from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import {
  AlignLeft,
  CheckSquare,
  Circle,
  FileUp,
  List,
  Calendar,
  Type,
} from "lucide-react";

const formElements = [
  { type: "text", label: "Text Field", icon: Type },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
  { type: "radio", label: "Radio Button", icon: Circle },
  { type: "file", label: "File Upload", icon: FileUp },
  { type: "dropdown", label: "Dropdown", icon: List },
  { type: "date", label: "Date Picker", icon: Calendar },
  { type: "textarea", label: "Paragraph Text", icon: AlignLeft },
];

const DraggableFormElement = ({ type, label, icon: Icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_ELEMENT",
    item: { type, label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`form-element flex items-center p-3 mb-2 bg-white rounded-lg shadow-sm border border-gray-200 cursor-move transition-colors duration-200 ${
        isDragging ? "opacity-50 bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      <Icon className="mr-3 text-blue-500" size={18} />
      <span className="text-gray-700">{label}</span>
    </motion.div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar w-64 p-5 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Elements</h2>
      <div className="space-y-3">
        {formElements.map((element) => (
          <DraggableFormElement key={element.type} {...element} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
