"use client";
import React, { useState } from "react";

interface Props {
  locations: string[];
  categories: string[];
  onChange: (filters: {
    query: string;
    location: string;
    category: string;
  }) => void;
  loading: boolean;
}

export default function Filters({
  locations,
  categories,
  onChange,
  loading,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleChange = (
    newQuery: string,
    newLocation: string,
    newCategory: string
  ) => {
    onChange({ query: newQuery, location: newLocation, category: newCategory });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search events..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleChange(e.target.value, selectedLocation, selectedCategory);
        }}
        className="w-full mb-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
      />

      <label className="block mb-2 font-medium text-gray-700">Location</label>
      <select
        value={selectedLocation}
        onChange={(e) => {
          setSelectedLocation(e.target.value);
          handleChange(query, e.target.value, selectedCategory);
        }}
        className="w-full mb-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
      >
        <option value="">All Locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>
            {loc}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-medium text-gray-700">Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => {
          setSelectedCategory(e.target.value);
          handleChange(query, selectedLocation, e.target.value);
        }}
        className="w-full mb-4 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {loading && <p className="text-gray-500 mt-2">Loading...</p>}
    </>
  );
}
