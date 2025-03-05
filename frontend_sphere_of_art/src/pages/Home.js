import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSortAlphaDown, faFilter, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const categories = ["Pencil Drawing", "Painting"];
  const artworkData = [
    { id: 1, title: "Eye Drop", category: "Pencil Drawing", image: "/images/eye.jpg" },
    { id: 2, title: "Glass Spill", category: "Pencil Drawing", image: "/images/glass.jpg" },
    { id: 3, title: "Fish Watercolor", category: "Painting", image: "/images/fish.jpg" },
    { id: 4, title: "Eye Painting", category: "Painting", image: "/images/eye paint.jpg" },
    { id: 5, title: "Horse", category: "Pencil Drawing", image: "/images/horse.jpg" },
    { id: 6, title: "Bird", category: "Painting", image: "/images/bird.jpg" },
    { id: 7, title: "Pikachu", category: "Pencil Drawing", image: "/images/pikachu.jpg" },
    { id: 8, title: "Sunset", category: "Painting", image: "/images/sunset.jpg" },
    { id: 9, title: "Mickey Mouse", category: "Pencil Drawing", image: "/images/mickey mouse.jpg" },
    { id: 10,title: "Girl",category: "Pencil Drawing", image: "/images/girl.jpg"},
    { id: 11,title: "Butterfly",category: "Pencil Drawing",image: "/images/butterfly.jpg"},
    { id: 12,title: "Mr Bean",category: "Pencil Drawing",image: "/images/mr bean.jpg"},
    { id: 13,title: "Murugan",category: "Pencil Drawing",image: "/images/murugar.jpg"},
    { id: 14,title: "Rose",category : "Pencil Drawing",image: "/images/rose.jpg"},
    { id: 15,title: "Lotus",category: "Painting",image: "/images/lotus.jpg"}
  ];

  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [pageIndex, setPageIndex] = useState({ 'Pencil Drawing': 0, 'Painting': 0 });

  const itemsPerPage = 5;

  const getDisplayedArtworks = () => {
    let filteredArtworks = artworkData;

    if (selectedCategory) {
      filteredArtworks = filteredArtworks.filter((art) => art.category === selectedCategory);
    }

    if (searchQuery) {
      filteredArtworks = filteredArtworks.filter((art) =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === "title") {
      filteredArtworks = [...filteredArtworks].sort((a, b) => a.title.localeCompare(b.title));
    }

    return filteredArtworks;
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white relative">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-green-400">Explore Art Forms</h1>

      {/* Search, Sort, and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="relative">
          <FontAwesomeIcon icon={faSortAlphaDown} className="absolute left-3 top-3 text-gray-400" />
          <select
            className="pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
          >
            <option value="">None</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        <div className="relative">
          <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-3 text-gray-400" />
          <select
            className="pl-10 p-2 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-400"
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

      {/* Main Gallery with Pagination */}
      <div className={selectedImage ? "filter blur-sm" : ""}>
        {categories.map((category) => {
          const categoryArtworks = getDisplayedArtworks().filter((art) => art.category === category);
          if (categoryArtworks.length === 0) return null;

          const totalPages = Math.ceil(categoryArtworks.length / itemsPerPage);
          const currentPage = pageIndex[category] || 0;
          const startIndex = currentPage * itemsPerPage;
          const displayedArtworks = categoryArtworks.slice(startIndex, startIndex + itemsPerPage);

          return (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-pink-400">{category}</h2>
              <div className="relative flex items-center">
                {currentPage > 0 && (
                  <button
                    onClick={() =>
                      setPageIndex((prev) => ({
                        ...prev,
                        [category]: Math.max(prev[category] - 1, 0),
                      }))
                    }
                    className="absolute left-0 p-3 text-white bg-gray-800 rounded-full shadow-md hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                )}

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mx-auto">
                  {displayedArtworks.map((art) => (
                    <div
                      key={art.id}
                      className="relative border border-gray-700 p-3 rounded-xl shadow-lg bg-gray-800 cursor-pointer group transition-all hover:border-yellow-400 hover:scale-105"
                      onClick={() => setSelectedImage(art)}
                    >
                      <img src={art.image} alt={art.title} className="w-48 h-48 object-cover rounded-lg" />
                      <p className="text-center font-medium mt-3 text-white">{art.title}</p>

                      <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex items-center justify-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view full size
                      </div>
                    </div>
                  ))}
                </div>

                {currentPage < totalPages - 1 && (
                  <button
                    onClick={() =>
                      setPageIndex((prev) => ({
                        ...prev,
                        [category]: Math.min(prev[category] + 1, totalPages - 1),
                      }))
                    }
                    className="absolute right-0 p-3 text-white bg-gray-800 rounded-full shadow-md hover:bg-gray-700"
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Overlay for selected image */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative p-4 bg-gray-900 rounded-lg shadow-xl">
            <img src={selectedImage.image} alt={selectedImage.title} className="max-h-[70vh] w-auto object-contain rounded-lg" />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-all"
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
