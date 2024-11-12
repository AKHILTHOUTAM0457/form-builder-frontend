import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FormBuilder from "./components/FormBuilder";
import FormPage from "./components/FormPage";
import FormList from "./components/FormList";
import FormResponses from "./components/FormResponses";
import EditForm from "./components/EditForm";

function App() {
  return (
    <Router>
      <div className="App font-sans">
        {/* <h1 className="text-3xl font-bold mt-4 mb-2 ml-48">Form Builder</h1> */}
        <Routes>
          <Route path="/" element={<FormList />} />
          <Route path="/form-builder" element={<FormBuilder />} />
          <Route path="/form/:id" element={<FormPage />} />
          <Route path="/form/:id/responses" element={<FormResponses />} />
          {/* <Route path="/form/:id/edit" element={<EditForm />} />{" "} */}
          {/* New Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
