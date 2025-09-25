import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";

interface NavbarProps {
  onGetStarted: () => void;
}

export function Navbar({ onGetStarted }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Glass navbar container with full glass effect */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-4xl shadow-2xl">
          {/* Additional glass overlay for enhanced effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-4xl"></div>

          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => scrollToSection("hero")}
              >
                <img
                  src="/logo.png"
                  alt="Legality Logo"
                  className="h-6 w-6 object-contain"
                />

                <span className="text-xl font-bold text-black tracking-tight">
                  Legality
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-black/90 hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-black/90 hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("services")}
                  className="text-black/90 hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                >
                  Services
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-black/90 hover:text-black transition-colors duration-200 font-medium cursor-pointer"
                >
                  FAQ
                </button>
              </div>

              {/* CTA Button */}
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={onGetStarted}
                  className="relative group px-6 py-2.5 bg-black text-white hover:text-orange-200 font-medium rounded-4xl border border-white/20 hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span className="relative z-10">Get Started</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-black hover:bg-white/20 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/20">
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => scrollToSection("about")}
                    className="text-black/90 hover:text-black text-left py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium"
                  >
                    About
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-black/90 hover:text-black text-left py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection("services")}
                    className="text-black/90 hover:text-black text-left py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium"
                  >
                    Services
                  </button>
                  <button
                    onClick={() => scrollToSection("faq")}
                    className="text-black/90 hover:text-black text-left py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium"
                  >
                    FAQ
                  </button>
                  <button
                    onClick={onGetStarted}
                    className="mt-3 px-4 py-2.5 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm text-black font-medium rounded-xl border border-white/20 hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-300 text-center"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
