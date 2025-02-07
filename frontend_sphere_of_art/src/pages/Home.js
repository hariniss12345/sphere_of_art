import React, { useState } from "react";

const HomePage = () => {
  // Sample artwork categories
  const categories = ["Drawing", "Painting"];

  // Sample artwork data stored in the frontend
  const artworkData = [
    { id: 1, title: "Eye Drop", category: "Drawing", image: "/images/eye.jpg" },
    { id: 2, title: " Glass Spill", category: "Drawing", image: "/images/glass.jpg" },
    { id: 3, title: "Fish Watercolor", category: "Painting", image: "/images/fish.jpg" },
    { id: 4, title: "Eye Painting", category: "Painting", image: "/images/eye paint.jpg" },
    { id: 5, title: " Horse", category: "Drawing", image: "/images/horse.jpg" },
    { id: 6, title: "Bird", category: "Painting", image: "/images/Bird.jpg" },
  ];

  // State for sorting & filtering
  const [sortBy, setSortBy] = useState(""); // Sort option
  const [selectedCategory, setSelectedCategory] = useState(""); // Selected category

  // Function to get displayed artworks based on filter/sort
  const getDisplayedArtworks = () => {
    let filteredArtworks = artworkData;

    // Filter by category if selected
    if (selectedCategory) {
      filteredArtworks = filteredArtworks.filter((art) => art.category === selectedCategory);
    }

    // Sort by title if selected
    if (sortBy === "title") {
      filteredArtworks = [...filteredArtworks].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filteredArtworks;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Art Forms</h1>

      {/* 🔹 Sorting & Filtering Options */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <label className="mr-2 font-medium">Sort By:</label>
          <select
            className="p-2 border rounded"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="">None</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Filter By Art:</label>
          <select
            className="p-2 border rounded"
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔹 Display Artworks Grouped By Category */}
      {categories.map((category) => {
        // Get artworks for this category
        const categoryArtworks = getDisplayedArtworks().filter(
          (art) => art.category === category
        );

        if (categoryArtworks.length === 0) return null; // Hide empty categories

        return (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoryArtworks.map((art) => (
                <div key={art.id} className="border p-2 rounded-lg shadow-md">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-90 object-cover rounded-lg"
                  />
                  <p className="text-center font-medium mt-2">{art.title}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
