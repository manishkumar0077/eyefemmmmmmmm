
import { Mail, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTypewriter } from 'react-simple-typewriter';
import PageTransition from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import DevelopersNavbar from "@/components/DevelopersNavbar";

const Developers = () => {
  const [text] = useTypewriter({
    words: ['Meet Our Development Team', 'The Minds Behind Eyefem', 'Our Talented Team'],
    loop: true,
    delaySpeed: 2000,
    typeSpeed: 50,
    deleteSpeed: 50,
  });

  const developers = [{
    name: "Shubham Malhotra",
    email: "malhotrashubham144@gmail.com",
    image: "/eyefemm_pic_uploads/shubham-new.jpg",
    role: "Lead Developer",
    linkedin: "https://www.linkedin.com/in/shubham-malhotra-302631291/",
    description: "Passionate about creating intuitive healthcare solutions"
  }, {
    name: "Sarthak Srivastava",
    email: "Sarthaksrivastava06052003@gmail.com",
    image: "/eyefemm_pic_uploads/sarthak-new.jpg",
    role: "Backend Developer",
    linkedin: "https://www.linkedin.com/in/sarthak-srivastava-11044b271/",
    description: "Expert in building robust and scalable backend systems"
  }, {
    name: "Naman Verma",
    email: "Kr.naman007@gmail.com",
    image: "/eyefemm_pic_uploads/naman-new.jpg",
    role: "Frontend Developer",
    linkedin: "https://www.linkedin.com/in/naman-verma-933184271/",
    description: "Specializing in creating beautiful and responsive user interfaces"
  }];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <DevelopersNavbar />
        <div className="pt-24 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 sm:mb-12 md:mb-16" data-aos="fade-up">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 min-h-[2.5em] sm:min-h-[2em] md:min-h-[1.8em] lg:min-h-[1.6em]">
                {text}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 sm:px-0">
                Built by aspiring developers during their college days, this website reflects the dedication and creativity behind Eyefem Healthcare's digital front.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {developers.map((dev, index) => (
                <Card 
                  key={dev.name} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 max-w-sm mx-auto w-full"
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={dev.image} 
                      alt={dev.name} 
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                    <p className="text-primary font-medium text-sm mb-2">{dev.role}</p>
                    <p className="text-gray-600 mb-4">{dev.description}</p>
                    <div className="flex space-x-4">
                      <a 
                        href={`mailto:${dev.email}`} 
                        className="text-gray-600 hover:text-primary transition-colors"
                        aria-label={`Email ${dev.name}`}
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                      <a 
                        href={dev.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-primary transition-colors"
                        aria-label={`${dev.name}'s LinkedIn profile`}
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/" className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Developers;
