import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";
import customercareImg from "../assets/customercare.jpg";

const Complaint = () => {
  const [complaint, setComplaint] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Load saved complaint from localStorage on component mount
  useEffect(() => {
    const savedComplaint = localStorage.getItem("complaintInput");
    if (savedComplaint) {
      setComplaint(savedComplaint);
    }
  }, []);

  // Save to localStorage whenever input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setComplaint(value);
    localStorage.setItem("complaintInput", value);
    setError(""); // Clear any previous errors
    setSuccess(false); // Clear success message
  };

  const handleSubmit = () => {
    if (!complaint.trim()) {
      setError("Please write your complaint before submitting");
      return;
    }

    setLoading(true);
    setError("");

    axios
      .post(`${BASE_URL}/complaint`, { complaint })
      .then((response) => {
        console.log(response.data);
        setSuccess(true);
        // Clear the complaint from localStorage and state
        localStorage.removeItem("complaintInput");
        setComplaint("");

        // Show success message then navigate after 2 seconds
        setTimeout(() => {
          navigate("/phone");
        }, 2000);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setError("Failed to submit complaint. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const isButtonEnabled = complaint.trim().length > 0;

  return (
    <div className="min-h-screen bg-white flex items-start justify-center pt-[7em] px-4">
      <div className="w-full max-w-sm bg-white px-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center mb-1">
              <img
                src={customercareImg}
                alt="Customer Care"
                className="w-16 rounded-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-xl font-medium text-gray-800 mb-2">
            Welcome to Grey Global
          </h1>
          <p className="text-sm text-gray-600">
            Kindly write your complaint or request in the box below
          </p>
        </div>

        {/* Text Input Box */}
        <div className="mb-6">
          <div className="border border-gray-300 rounded-lg p-4 min-h-[120px] focus-within:border-gray-500 transition-colors">
            <textarea
              value={complaint}
              onChange={handleInputChange}
              placeholder="Write your complaint or request here..."
              className="w-full h-full resize-none border-none outline-none placeholder:text-gray-400 text-gray-800"
              rows={4}
              disabled={loading || success}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              Complaint submitted successfully! Redirecting...
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 leading-relaxed">
            Your complaint or request will be sent to our customer care team for
            review.{" "}
            <span className="font-medium">Click submit to continue</span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isButtonEnabled || loading || success}
          className={`w-full py-3 rounded-md font-semibold text-white transition-all duration-200 ${
            !isButtonEnabled || success
              ? "bg-gray-300 cursor-not-allowed"
              : loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          {loading
            ? "Submitting..."
            : success
            ? "Submitted!"
            : "Submit Complaint"}
        </button>
      </div>
    </div>
  );
};

export default Complaint;
