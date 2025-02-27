import React, { useState } from "react";

const HomePage = () => {
  const categories = ["Drawing", "Painting"];
  const artworkData = [
    { id: 1, title: "Eye Drop", category: "Drawing", image: "/images/eye.jpg" },
    { id: 2, title: "Glass Spill", category: "Drawing", image: "/images/glass.jpg" },
    { id: 3, title: "Fish Watercolor", category: "Painting", image: "/images/fish.jpg" },
    { id: 4, title: "Eye Painting", category: "Painting", image: "/images/eye paint.jpg" },
    { id: 5, title: "Horse", category: "Drawing", image: "/images/horse.jpg" },
    { id: 6, title: "Bird", category: "Painting", image: "/images/Bird.jpg" },
  ];

  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const getDisplayedArtworks = () => {
    let filteredArtworks = artworkData;

    if (selectedCategory) {
      filteredArtworks = filteredArtworks.filter(
        (art) => art.category === selectedCategory
      );
    }

    if (sortBy === "title") {
      filteredArtworks = [...filteredArtworks].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return filteredArtworks;
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white relative">
      <h1 className="text-3xl font-bold mb-6 text-center">Explore Art Forms</h1>

      {/* Sorting & Filtering Options */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <label className="mr-2 font-medium">Sort By:</label>
          <select
            className="p-2 border border-gray-700 rounded bg-gray-800 text-white"
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
            className="p-2 border border-gray-700 rounded bg-gray-800 text-white"
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

      {/* Main gallery */}
      <div className={selectedImage ? "filter blur-sm" : ""}>
        {categories.map((category) => {
          const categoryArtworks = getDisplayedArtworks().filter(
            (art) => art.category === category
          );
          if (categoryArtworks.length === 0) return null;
          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoryArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="relative border border-gray-700 p-2 rounded-lg shadow-md bg-gray-900 cursor-pointer group"
                    onClick={() => setSelectedImage(art)}
                  >
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <p className="text-center font-medium mt-2">{art.title}</p>
                    
                    {/* Hover Message */}
                    <div className="absolute inset-0 bg-black bg-opacity-60 text-white flex items-center justify-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Please select the image to see full size
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlay for selected image */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="max-h-screen object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
