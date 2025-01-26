export default function Home() {
    const arts = [
      { id: 1, title: "Tree Painting", src: "/images/art1.jpg" },
      { id: 2, title: "Rose Sketch", src: "/images/art2.jpg" },
    ];
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Explore The Art Forms</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {arts.map((art) => (
            <div key={art.id} className="rounded-xl shadow-lg">
              <img
                src={art.src}
                alt={art.title}
                className="rounded-t-xl w-full h-64 object-cover"
              />
              <p className="text-center mt-2">{art.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  