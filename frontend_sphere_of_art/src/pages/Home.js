export default function Home() {
    const arts = [
      { id: 1, title: "Tree Painting", src: "/images/art1.jpg" },
      { id: 2, title: "Rose Sketch", src: "/images/art2.jpg" },
      { id: 3, title: "Mountain View", src: "/images/art3.jpg" },
      { id: 4, title: "drawing", src: "/images/art1.jpg"}
    ];
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Explore The Art Forms</h1>
        <div
          className="grid grid-cols-3 gap-4"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}
        >
          {arts.map((art) => (
            <div
              key={art.id}
              style={{
                border: "1px solid black",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
              }}
            >
              <img
                src={art.src}
                alt={art.title}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
              />
              <p style={{ textAlign: "center", marginTop: "8px" }}>{art.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  