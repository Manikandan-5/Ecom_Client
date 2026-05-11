import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const Carousel = ({ slides = [], autoPlayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  // Default slides if none provided
  const defaultSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=600&fit=crop",
  title: "Style That Speaks",
    quote: "Wear confidence like your favorite outfit."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop",
          title: "Bold & Beautiful",
    quote: "Fashion made to turn heads everywhere."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1622290291720-ac961c43ee30?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
         title: "Mini Fashion Stars",
    quote: "Stylish looks for every little adventure."
    }
  ];

  const carouselSlides = slides.length > 0 ? slides : defaultSlides;

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
    
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full overflow-hidden group">
      {/* Carousel Container */}
      <div 
        className="relative h-[400px] sm:h-[500px] lg:h-[600px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
     <div
  className="flex transition-transform duration-700 ease-out h-full"
  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
>
  {carouselSlides.map((slide, index) => (
    <div key={slide.id} className="relative w-full h-full flex-shrink-0">
      
      {/* Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover"
        loading={index === 0 ? "eager" : "lazy"}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        
        <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg mb-4 animate-fadeIn">
          {slide.title}
        </h1>

        <p className="text-gray-200 text-lg md:text-2xl max-w-2xl italic font-light leading-relaxed">
          "{slide.quote}"
        </p>

      </div>
    </div>
  ))}
</div>

        {/* Auto-play Toggle */}
        <button
          onClick={toggleAutoPlay}
          className="absolute bottom-20 md:bottom-24 right-2 md:right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
          aria-label={isAutoPlaying ? "Pause" : "Play"}
        >
          {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
                setTimeout(() => setIsAutoPlaying(true), 10000);
              }}
              className={`transition-all duration-300 ${
                currentIndex === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/70"
              } rounded-full`}
            />
          ))}
        </div>

        {/* Slide Info */}
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs md:text-sm">
          {currentIndex + 1} / {carouselSlides.length}
        </div>
      </div>
    </div>
  );
};

export default Carousel;