import { useRef, useEffect } from "react";

export default function MainPage() {
    const videoRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (videoRef.current) {
                const rect = videoRef.current.getBoundingClientRect();
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    videoRef.current.play();
                } else {
                    videoRef.current.pause();
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="relative w-full h-screen flex justify-center items-center overflow-hidden bg-black">
            {/* Background Video */}
            <video
                ref={videoRef}
                src="/images/main-video.mp4"
                className="w-[100%] h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                muted
                loop
                playsInline
            />
        </div>
    );
}
