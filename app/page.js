'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [badgeData, setBadgeData] = useState({});
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');  // Add a state for server-side error messages
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!badgeData.name) newErrors.name = 'Name is required';
    if (!badgeData.university) newErrors.university = 'University is required';
    if (!badgeData.major) newErrors.major = 'Major is required';
    if (!badgeData.graduationDate) newErrors.graduationDate = 'Graduation Date is required';

    setErrors(newErrors);
    
    // If no errors, return true
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset server error message
    setServerError('');

    if (!validateForm()) return;

    const { name, university, major, graduationDate, github } = badgeData;

    try {
      const response = await axios.post('/api/badges', {
        name,
        university,
        major,
        graduationDate,
        github,
      });

      if (response.status === 200) {
        const { id } = response.data;
        router.push(`/profile/${id}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setServerError(error.response.data.error);  // Show error message from the server
      } else {
        console.error('Error submitting form:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBadgeData({ ...badgeData, [name]: value });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Bar with Logo */}
      <header className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src="/logo.jpg" alt="CalHacks Logo" className="w-12 h-12 rounded-full mr-4" />
          <h1 className="text-3xl font-bold">CalHacks</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">Create Your Hacker Badge</h1>
        <form onSubmit={handleSubmit} className="bg-blue-50 p-6 rounded-lg shadow-md">
          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-lg font-semibold text-blue-700 mb-2">Name:</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              className={`border rounded px-4 py-2 w-full ${errors.name ? 'border-red-500' : 'border-blue-300'} focus:ring focus:ring-blue-200`}
              style={{ color: 'black' }}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          {/* University Field */}
          <div className="mb-4">
            <label className="block text-lg font-semibold text-blue-700 mb-2">University:</label>
            <input
              type="text"
              name="university"
              onChange={handleChange}
              className={`border rounded px-4 py-2 w-full ${errors.university ? 'border-red-500' : 'border-blue-300'} focus:ring focus:ring-blue-200`}
              style={{ color: 'black' }}
            />
            {errors.university && <p className="text-red-500">{errors.university}</p>}
          </div>

          {/* Major Field */}
          <div className="mb-4">
            <label className="block text-lg font-semibold text-blue-700 mb-2">Major:</label>
            <input
              type="text"
              name="major"
              onChange={handleChange}
              className={`border rounded px-4 py-2 w-full ${errors.major ? 'border-red-500' : 'border-blue-300'} focus:ring focus:ring-blue-200`}
              style={{ color: 'black' }}
            />
            {errors.major && <p className="text-red-500">{errors.major}</p>}
          </div>

          {/* Graduation Date Field */}
          <div className="mb-4">
            <label className="block text-lg font-semibold text-blue-700 mb-2">Graduation Date:</label>
            <input
              type="date"
              name="graduationDate"
              onChange={handleChange}
              className={`border rounded px-4 py-2 w-full ${errors.graduationDate ? 'border-red-500' : 'border-blue-300'} focus:ring focus:ring-blue-200`}
              style={{ color: 'black' }}
            />
            {errors.graduationDate && <p className="text-red-500">{errors.graduationDate}</p>}
          </div>

          {/* GitHub Field (Optional) */}
          <div className="mb-4">
            <label className="block text-lg font-semibold text-blue-700 mb-2">GitHub (optional):</label>
            <input
              type="text"
              name="github"
              onChange={handleChange}
              className="border rounded px-4 py-2 w-full border-blue-300 focus:ring focus:ring-blue-200"
              style={{ color: 'black' }}
            />
          </div>

          {/* Server Error Message */}
          {serverError && <p className="text-red-500 mb-4">{serverError}</p>}

          {/* Submit Button */}
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-200">
            Generate Badge
          </button>
        </form>
      </div>
    </div>
  );
}
