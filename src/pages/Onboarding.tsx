import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Welcome to Ubuntu Hub",
    description: "Your all-in-one platform for community connection and engagement",
    icon: "🌍",
  },
  {
    title: "Discover Communities",
    description: "Join organizations, attend events, and connect with like-minded people",
    icon: "🤝",
  },
  {
    title: "Grow Your Network",
    description: "Create digital business cards and expand your professional connections",
    icon: "💼",
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (hasSeenOnboarding) {
      navigate("/", { replace: true });
      return;
    }

    // Hide splash after 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/auth");
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    navigate("/");
  };

  // Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-7xl mb-4"
          >
            🌍
          </motion.div>
          <h1 className="text-3xl font-bold text-primary-foreground">Ubuntu Hub</h1>
          <p className="text-primary-foreground/70 mt-2">Community United</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip Button */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="w-32 h-32 mx-auto rounded-full gradient-primary-soft flex items-center justify-center mb-8">
              <span className="text-6xl">{slides[currentSlide].icon}</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {slides[currentSlide].title}
            </h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress & Navigation */}
      <div className="p-8 pb-12">
        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full h-14 gradient-primary text-primary-foreground rounded-xl font-semibold text-lg shadow-glow"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </motion.button>
      </div>
    </div>
  );
}
