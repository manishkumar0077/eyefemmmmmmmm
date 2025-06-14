import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

interface WhatsAppChatProps {
  className?: string;
}

const WhatsAppChat = ({ className = "" }: WhatsAppChatProps) => {
  const location = useLocation();
  const isEyecare = location.pathname.includes("/eyecare");
  const isGynecology = location.pathname.includes("/gynecology");
  const initialized = useRef(false);

  // Use the appropriate app ID based on the current section
  const appId = isGynecology
    ? "f5987c20-7de0-4b19-a688-ad23bc2c6457" // Gynecology WhatsApp widget
    : "a33bc770-938d-4a29-a90b-1d1514e16817"; // Eye Care WhatsApp widget (default)

  useEffect(() => {
    // Only load the script if we're in a relevant section
    if ((isEyecare || isGynecology) && !initialized.current) {
      // Load Elfsight script if it hasn't been loaded already
      if (!document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]')) {
        const script = document.createElement("script");
        script.src = "https://static.elfsight.com/platform/platform.js";
        script.async = true;
        document.body.appendChild(script);
      }

      // Trigger Elfsight to initialize or reinitialize
      if (window.elfsight) {
        window.elfsight.reinstall();
      }

      initialized.current = true;
    }

    // When route changes, reinitialize the widget if needed
    return () => {
      if (window.elfsight && (isEyecare || isGynecology)) {
        window.elfsight.reinstall();
      }
    };
  }, [isEyecare, isGynecology, location.pathname]);

  // Don't render on the homepage, gallery, speciality page, or non-department pages
  const isHomepage = location.pathname === "/" || location.pathname === "/home";
  const isGallery = location.pathname.includes("/gallery");
  const isSpeciality = location.pathname.includes("/specialties") || location.pathname.includes("/speciality");
  
  if (!isEyecare && !isGynecology || isHomepage || isGallery || isSpeciality) {
    return null;
  }

  return (
    <div
      className={`elfsight-app-${appId} ${className}`}
      data-elfsight-app-lazy
    />
  );
};

// Add this to make TypeScript happy with the window.elfsight property
declare global {
  interface Window {
    elfsight?: {
      reinstall: () => void;
    };
  }
}

export default WhatsAppChat;
