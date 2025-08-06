"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Phone, Mail, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logger } from '@/lib/logger';

const spinnerClass = `
  inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]
`;

interface Process {
  id: string;
  name: string;
  slug: string;
  href: string;
  isMenuActive: boolean;
}

interface ContactContent {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  phone: string;
  email: string;
  address: string;
  mapLink?: string;
  image?: string;
  isActive: boolean;
}

const SuccessModal = ({ isOpen, message, onClose }: { isOpen: boolean; message: string; onClose: () => void }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg p-4 max-w-sm w-full mx-4 relative shadow-xl"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="mb-3 mt-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-600"
            >
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          </div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Success!
            </h3>
            <p className="text-sm text-gray-600">{message}</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InputField = ({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  children,
  className = "",
  tabIndex,
  onKeyPress,
  error,
}: {
  label: string;
  id: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  children?: React.ReactNode;
  className?: string;
  tabIndex?: number;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  error?: string;
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block mb-1 text-xs font-medium text-gray-800 dark:text-gray-300 font-inter"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <>
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyPress={onKeyPress}
            tabIndex={tabIndex}
            className={`shadow-sm bg-white border ${
              error ? "border-red-500" : "border-gray-300"
            } text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all duration-200`}
            placeholder={placeholder}
            required={required}
            autoComplete={
              name === "email" ? "email" : name === "fullName" ? "name" : "off"
            }
          />
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </>
      )}
    </div>
  );
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    processType: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [processesLoading, setProcessesLoading] = useState(true);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [contactContentLoading, setContactContentLoading] = useState(true);

  const fieldOrder = ["fullName", "email", "mobile", "processType", "message"];

  // Fetch active processes and contact content
  useEffect(() => {
    fetchActiveProcesses();
    fetchContactContent();
  }, []);

  const fetchContactContent = async () => {
    try {
      setContactContentLoading(true);
      const response = await fetch('/api/admin/content/contact');
      if (response.ok) {
        const data = await response.json();
        setContactContent(data);
      } else {
        logger.error('Failed to fetch contact content');
      }
    } catch (error) {
      logger.error('Error fetching contact content:', error);
    } finally {
      setContactContentLoading(false);
    }
  };

  const fetchActiveProcesses = async () => {
    try {
      setProcessesLoading(true);
      const response = await fetch('/api/content/process-activation');
      if (response.ok) {
        const allProcesses = await response.json();
        // Filter only active processes
        const activeProcesses = allProcesses.filter((process: Process) => process.isMenuActive);
        setProcesses(activeProcesses);
      } else {
        logger.error('Failed to fetch processes');
      }
    } catch (error) {
      logger.error('Error fetching processes:', error);
    } finally {
      setProcessesLoading(false);
    }
  };

  const validateField = useCallback((name: string, value: string) => {
    switch (name) {
      case "fullName":
        return value.trim() === "" ? "Full name is required" : "";
      case "email":
        return value.trim() === ""
          ? "Email address is required"
          : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address"
          : "";
      case "mobile":
        return value.trim() === ""
          ? "Phone number is required"
          : !/^(?:\+\d{1,3})?\s?\d{10}$/.test(value)
          ? "Please enter a valid phone number"
          : "";
      case "processType":
        return value.trim() === "" ? "Please select a process type" : "";
      default:
        return "";
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (!touched[name]) {
        setTouched((prev) => ({
          ...prev,
          [name]: true,
        }));
      }

      if (formSubmitted || touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [formSubmitted, touched, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, name: string) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const currentIndex = fieldOrder.indexOf(name);
        if (currentIndex < fieldOrder.length - 1) {
          const nextFieldName = fieldOrder[currentIndex + 1];
          const nextField = document.getElementById(nextFieldName);
          if (nextField) {
            (nextField as HTMLElement).focus();
          }
        } else {
          document.getElementById("submitButton")?.click();
        }
      }
    },
    [fieldOrder]
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fieldOrder.forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setTouched({
      fullName: true,
      email: true,
      mobile: true,
      processType: true,
      message: true,
    });
    setErrors(newErrors);
    return isValid;
  };

  const submitToGoogleSheets = async () => {
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby_ALSBEGxhl6pvJtTsbx3Fv5cTcas9pF240_4bhjY9mx7mUdoPDq4ff-603MD4pgttfA/exec";

    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("email", formData.email);
      payload.append("mobile", formData.mobile);
      payload.append("processType", formData.processType);
      payload.append("message", formData.message);
      payload.append("timestamp", new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        body: payload,
        mode: "no-cors",
      });

      return true;
    } catch (error) {
      logger.error("Error submitting to Google Sheets:", error);
      throw new Error("Failed to save data. Please try again later.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!validateForm()) {
      for (const fieldName of fieldOrder) {
        if (errors[fieldName]) {
          document.getElementById(fieldName)?.focus();
          break;
        }
      }
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      // Submit to our database and send emails
      const submissionResponse = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!submissionResponse.ok) {
        const errorData = await submissionResponse.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const result = await submissionResponse.json();
      
      // Submit to Google Sheets (optional)
      try {
        await submitToGoogleSheets();
      } catch (sheetsError) {
        logger.error('Google Sheets submission failed:', sheetsError);
        // Don't throw error here - form submission was successful
      }
      
      setShowSuccessModal(true);
      handleCancel();
    } catch (error: any) {
      logger.error("Error submitting form:", error);
      setErrorMessage(error.message || "There was an error sending your message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      processType: "",
      message: "",
    });
    setErrorMessage("");
    setErrors({});
    setTouched({});
    setFormSubmitted(false);
  };

  useEffect(() => {
    document.getElementById("fullName")?.focus();
  }, []);

  // Dynamic contact info based on content
  const contactInfo = [
    {
      icon: <Phone className="w-4 h-4" />,
      text: contactContent?.phone || "+91 93731 02887",
      href: `tel:${contactContent?.phone || "+919373102887"}`,
    },
    {
      icon: <Mail className="w-4 h-4" />,
      text: contactContent?.email || "asgoals0494@gmail.com",
      href: `mailto:${contactContent?.email || "asgoals0494@gmail.com"}`,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      text: contactContent?.address || "123 Industrial Area, Nashik, Maharashtra - 422009",
      href: contactContent?.mapLink || "https://maps.app.goo.gl/example",
    },
  ];

  if (contactContentLoading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4 lg:px-6 font-inter mt-5">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <AnimatePresence>
        {showSuccessModal && (
          <SuccessModal
            isOpen={showSuccessModal}
            message="Your enquiry has been submitted successfully. We'll get back to you soon!"
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-4 lg:px-6 font-inter mt-5">
        <div className="flex flex-col-reverse lg:flex-row gap-6">
          {/* Contact Info & Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/3 bg-white rounded-lg overflow-hidden border"
          >
            {/* Image */}
            <div className="h-64 w-full">
              <img
                src={contactContent?.image || "/uploads/9ea6ded4-4ad0-4ff5-9eb4-83c6cdbb593d.webp"}
                alt="Plating Facility"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 space-y-4 pt-5">
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {item.icon}
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-500">
                        {item.text}
                      </p>
                      <p className="text-sm text-gray-900">
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 transition-colors"
                        >
                          {item.text}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-2/3 bg-white rounded-lg overflow-hidden border"
          >
            <div className="p-4 sm:p-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {contactContent?.title || "Contact Us"}
                </h3>
                
                <div className="border-b border-gray-200 mb-4"></div>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <InputField
                  label="Full Name"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Full Name"
                  required
                  tabIndex={1}
                  onKeyPress={(e) => handleKeyPress(e, "fullName")}
                  error={touched.fullName && errors.fullName ? errors.fullName : undefined}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="abc@example.com"
                    required
                    tabIndex={2}
                    onKeyPress={(e) => handleKeyPress(e, "email")}
                    error={touched.email && errors.email ? errors.email : undefined}
                  />
                  <InputField
                    label="Mobile No."
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="+91 **********"
                    required
                    tabIndex={3}
                    onKeyPress={(e) => handleKeyPress(e, "mobile")}
                    error={touched.mobile && errors.mobile ? errors.mobile : undefined}
                  />
                </div>

                <div>
                  <label
                    htmlFor="processType"
                    className="block mb-1 text-xs font-medium text-gray-800 dark:text-gray-300 font-inter"
                  >
                    Select Process <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="processType"
                    name="processType"
                    value={formData.processType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    tabIndex={4}
                    onKeyPress={(e) => handleKeyPress(e, "processType")}
                    className={`shadow-sm bg-white border ${
                      touched.processType && errors.processType
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all duration-200`}
                    required
                    disabled={processesLoading}
                  >
                    <option value="">
                      {processesLoading ? "Loading processes..." : "Select Process"}
                    </option>
                    {processes.map((process) => (
                      <option key={process.id} value={process.name}>
                        {process.name}
                      </option>
                    ))}
                  </select>
                  {touched.processType && errors.processType && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.processType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block mb-1 text-xs font-medium text-gray-800 dark:text-gray-300 font-inter"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    tabIndex={5}
                    onKeyPress={(e) => handleKeyPress(e, "message")}
                    className="shadow-sm bg-white border border-gray-300 text-gray-900 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all duration-200"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    id="submitButton"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    {loading ? (
                      <>
                        <span className={spinnerClass}></span>
                        <span className="ml-2">Submitting...</span>
                      </>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 