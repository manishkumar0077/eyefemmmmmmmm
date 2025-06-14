import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const DevelopersNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="h-14 w-auto flex items-center">
              <img
                src="/eyefemm_pic_uploads/6c43213d-6d60-4790-b8ff-d662e634ee59.png"
                alt="EyeFem Clinic"
                className="h-16 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-800" />
            ) : (
              <Menu className="h-6 w-6 text-gray-800" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/eyecare"
              className="text-gray-800 hover:text-primary transition-colors"
            >
              Eye Care
            </Link>
            <Link
              to="/gynecology"
              className="text-gray-800 hover:text-primary transition-colors"
            >
              Gynecology
            </Link>
            <Link
              to="/gynecology/doctor"
              className="text-gray-800 hover:text-primary transition-colors"
            >
              Dr. Nisha Bhatnagar
            </Link>
            <Link
              to="/eyecare/doctor"
              className="text-gray-800 hover:text-primary transition-colors"
            >
              Dr. Sanjeev Lehri
            </Link>
            <Link
              to="/gallery"
              className="text-gray-800 hover:text-primary transition-colors"
            >
              Gallery
            </Link>
          </nav>
        </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                <Link
                  to="/eyecare"
                  className="text-gray-800 hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Eye Care
                </Link>
                <Link
                  to="/gynecology"
                  className="text-gray-800 hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Gynecology
                </Link>
                <Link
                  to="/gynecology/doctor"
                  className="text-gray-800 hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Dr. Nisha Bhatnagar
                </Link>
                <Link
                  to="/eyecare/doctor"
                  className="text-gray-800 hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Dr. Sanjeev Lehri
                </Link>
                <Link
                  to="/gallery"
                  className="text-gray-800 hover:text-primary transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  Gallery
                </Link>
              </div>
            </div>
          )}
      </div>
    </header>
  );
};

export default DevelopersNavbar;
