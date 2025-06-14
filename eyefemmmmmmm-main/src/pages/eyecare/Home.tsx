import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EyeCareLayout from "@/components/EyeCareLayout";
import Footer from "@/components/Footer";
import { useEyeCareConditions } from '@/hooks/useEyeCareConditions';
import { useEyeCareTabServicesLatest } from '@/hooks/useEyeCareTabServicesLatest';
import { useEyeCareWhyChoose } from '@/hooks/UseEyeCareWhyChoose';
import { useEyecareImages } from '@/hooks/useEyecareImages';
import { useEyeCareProcedures } from '@/hooks/useEyeCareProcedures';
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useEyecareHeroSection } from '@/hooks/useEyecareHeroSection';
import { useEyeCareDetails } from '@/hooks/useEyeCareDetails';

import { useEffect, useState, useRef } from 'react';

const EyeCareHome = () => {
  // Use our new hook to get the services data
  const { sections, isLoading, activeSection, setActiveSection } = useEyeCareTabServicesLatest();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // For tabs functionality on mobile
  const tabsListRef = useRef<HTMLDivElement>(null);

  // Removed scrolling arrows for cleaner mobile UI

  // Set active section when data loads
  useEffect(() => {
    if (!isLoading && sections.length > 0) {
      // Set the first section as active if no active section is set
      if (!activeSectionId) {
        setActiveSectionId(sections[0].id);
        setActiveSection(sections[0].id);
      }
    }
  }, [sections, isLoading, activeSectionId, setActiveSection]);

  // Update active section id when activeSection changes
  useEffect(() => {
    if (activeSection) {
      setActiveSectionId(activeSection);
    }
  }, [activeSection]);

  const { section: conditionsSection, conditions, isLoading: conditionsLoading } = useEyeCareConditions();
  const { section: whyChooseSection, features, isLoading: whyChooseLoading } = useEyeCareWhyChoose();
  const { images, setCurrentCategory, refreshData } = useEyecareImages("home");
  const { heroSection, isLoading: heroLoading } = useEyecareHeroSection();

  // Ensure images are loaded when the component mounts
  useEffect(() => {
    console.log("Home component mounted, setting category and refreshing data");
    setCurrentCategory("home");
    refreshData();
  }, []);


  useEffect(() => {
    console.log("Home images updated:", images);
  }, [images]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log("Image failed to load:", e.currentTarget.src);
    e.currentTarget.src = "/eyefemm_pic_uploads/default-image.png";
  };

  const getImageUrl = (index: number, defaultAlt: string) => {
    if (images && images.length > index) {
      console.log(`Using image at index ${index}:`, images[index].image_url);
      return {
        url: images[index].image_url,
        alt: images[index].title || defaultAlt
      };
    }
    console.log(`No image at index ${index}, using default`);
    return {
      url: "/eyefemm_pic_uploads/default-image.png",
      alt: defaultAlt
    };
  };

  const heroImage = getImageUrl(0, "Eye Examination");
  const clinicImage = getImageUrl(1, "Modern Eye Clinic");
  const { procedures, isLoading: proceduresLoading } = useEyeCareProcedures();
  const { details, isLoading: detailsLoading } = useEyeCareDetails();

  return (
    <EyeCareLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-eyecare text-white py-8 sm:py-12 md:py-16 lg:py-20">

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div data-aos="fade-right">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                data-editable="true"
                data-selector="eyecare-home-h1"
              >
                {heroSection?.title || "Advanced Eye Care Services"}
              </h1>
              <p
                className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90"
                data-editable="true"
                data-selector="eyecare-home-hero-p"
              >
                {heroSection?.subtitle || "Experience the highest quality of eye care with our state-of-the-art technology and the expertise of Dr. Sanjeev Lehri."}
              </p>
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
                <Link to="/eyecare/appointment" className="w-full sm:w-auto">
                  <Button
                    className="mac-btn bg-white text-eyecare hover:bg-white/90 w-full sm:w-auto text-xs sm:text-sm md:text-base px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3"
                    data-editable="true"
                    data-selector="eyecare-home-button-1"
                  >
                    Book an Appointment
                  </Button>
                </Link>
                <Link to="/eyecare/conditions" className="w-full sm:w-auto">
                  <Button
                    className="mac-btn bg-transparent border border-white text-white hover:bg-white/10 w-full sm:w-auto text-xs sm:text-sm md:text-base px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3"
                    data-editable="true"
                    data-selector="eyecare-home-button-2"
                  >
                    Explore Treatments
                  </Button>
                </Link>
              </div>
            </div>
            <div
              className="rounded-2xl overflow-hidden shadow-xl"
              data-aos="fade-left"
            >
              {heroLoading ? (
                <div className="bg-gray-300 animate-pulse w-full h-64 md:h-96"></div>
              ) : (
                <img
                  src={heroSection?.image_url || heroImage.url}
                  alt={heroSection?.title || heroImage.alt}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                  data-editable="true"
                  data-selector="eyecare-home-hero-img"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Common Eye Problems Section */}
      <section className="py-10 sm:py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-10 md:mb-14">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
              data-editable="true"
              data-selector="eyecare-conditions-heading"
            >
              {conditionsSection?.heading || "Common Eye Conditions We Treat"}
            </h2>
            <p
              className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto px-2"
              data-editable="true"
              data-selector="eyecare-conditions-description"
            >
              {conditionsSection?.description || "Our eye care center specializes in diagnosing and treating a wide range of eye conditions."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {conditionsLoading ? (
              // Loading state
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse h-48"></div>
              ))
            ) : conditions.length > 0 ? (
              // Dynamic conditions from database
              conditions.map((condition, index) => (
                <div
                  key={condition.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
                  data-aos="fade-up"
                  data-aos-delay={100 * (index % 3)}
                >
                  <h3
                    className="text-xl font-bold mb-3 text-blue-600"
                    data-editable="true"
                    data-selector={`eyecare-condition-${condition.id}-title`}
                  >
                    {condition.title}
                  </h3>
                  <p
                    className="text-gray-600"
                    data-editable="true"
                    data-selector={`eyecare-condition-${condition.id}-description`}
                  >
                    {condition.description}
                  </p>
                </div>
              ))
            ) : (
              // Fallback static content
              [
                "Cataracts",
                "Glaucoma",
                "Diabetic Retinopathy",
                "Dry Eye Syndrome",
                "Age-related Macular Degeneration",
                "Refractive Errors"
              ].map((title, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100"
                  data-aos="fade-up"
                  data-aos-delay={100 * (index % 3)}
                >
                  <h3 className="text-xl font-bold mb-3 text-blue-600">
                    {title}
                  </h3>
                  <p className="text-gray-600">
                    {/* Generic descriptions for fallback */}
                    {title === "Cataracts" && "Clouding of the eye's natural lens that affects vision."}
                    {title === "Glaucoma" && "A group of eye conditions that damage the optic nerve."}
                    {title === "Diabetic Retinopathy" && "Damage to the retina caused by diabetes complications."}
                    {title === "Dry Eye Syndrome" && "A condition where tears aren't able to provide adequate lubrication."}
                    {title === "Age-related Macular Degeneration" && "A leading cause of vision loss among older adults."}
                    {title === "Refractive Errors" && "Vision problems like myopia, hyperopia, and astigmatism."}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Services Tabs Section */}
      <section className="py-8 px-0 sm:px-4">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-eyecare mb-4" />
              <p className="text-gray-500 text-lg">Loading services...</p>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No services found. Please check back later.</p>
            </div>
          ) : (
            <Tabs
              defaultValue={activeSectionId || sections[0]?.id}
              onValueChange={setActiveSection}
              className="w-full"
            >
              <div className="text-center mb-6 sm:mb-8 md:mb-10" data-aos="fade-up" data-aos-duration="800">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6 text-eyecare" data-aos="fade-up" data-aos-delay="100">
                  Eye Care Services
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Comprehensive eye care services to help maintain and improve your vision health.
                </p>
              </div>
              <div className="flex items-center mb-4 sm:mb-6 md:mb-8 relative overflow-hidden">
                {/* Mobile scroll indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent sm:hidden"></div>

                <div
                  ref={tabsListRef}
                  className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mx-auto flex-grow py-2 px-3 sm:px-6 -mx-2 sm:mx-0"
                >
                  <TabsList className="bg-gray-100 flex space-x-1 sm:space-x-2 p-1.5 h-auto w-max min-w-full justify-start sm:justify-center rounded-full shadow-sm">
                    {sections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={section.id}
                        className="px-4 sm:px-5 py-2.5 rounded-full data-[state=active]:bg-eyecare data-[state=active]:text-white data-[state=active]:shadow-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eyecare/50 transition-all"
                      >
                        {section.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              {/* Dynamic Content Tabs */}
              {sections.map(section => (
                <TabsContent key={section.id} value={section.id} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="order-2 md:order-1">
                      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-eyecare">{section.title}</h2>
                      <div className="space-y-4 sm:space-y-6">
                        {section.subsections && section.subsections.map(subsection => (
                          <div key={subsection.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                            <div className="flex items-center mb-3">
                              <div className="flex justify-center items-center w-10 h-10 rounded-full bg-blue-100 text-eyecare mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                  <path d="m9 12 2 2 4-4"></path>
                                </svg>
                              </div>
                              <h3 className="text-lg sm:text-xl font-semibold">{subsection.title}</h3>
                            </div>
                            {subsection.description && (
                              <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base ml-13">{subsection.description}</p>
                            )}
                            {subsection.items && subsection.items.length > 0 && (
                              <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                                {subsection.items.map(item => (
                                  <li key={item.id}>
                                    {item.label && (
                                      <span className="font-medium">{item.label}{item.description ? ':' : ''}</span>
                                    )}
                                    {item.description && (
                                      <p>{item.description}</p>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {section.image_url && (
                      <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0" data-aos="fade-up" data-aos-duration="800">
                        <div className="flex items-center justify-center h-80 w-full">
                          <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md h-80">
                            <img
                              src={section.image_url}
                              alt={`${section.title} image`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={handleImageError}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-eyecare">
              Dr. Sanjeev  Lehri
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dr. Lehri uses the latest technology to provide comprehensive eye care services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {proceduresLoading ? (
              <div className="animate-pulse">
                <div className="h-72 bg-gray-200 rounded-lg"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 w-3/4 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 w-full rounded"></div>
                </div>
              </div>
            ) : procedures.length > 0 ? (
              <div className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <img
                  src={procedures[0].image_url}
                  alt={procedures[0].alt_text}
                  className="w-full h-72 object-cover transition-transform duration-500 hover:scale-110"
                  onError={handleImageError}
                />
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg text-eyecare">{procedures[0].title}</h3>
                  <p className="text-gray-600">{procedures[0].description}</p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <img src="/eyefemm_pic_uploads/fb9680b4-f1d5-45ff-a9dd-2b5e8f7a9e9e.png" alt="Advanced eye examination equipment" className="w-full h-72 object-cover transition-transform duration-500 hover:scale-110" />
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg text-eyecare">Advanced Diagnostic Testing</h3>
                  <p className="text-gray-600">Early detection of eye conditions with cutting-edge equipment</p>
                </div>
              </div>
            )}

            {detailsLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 w-full rounded"></div>
                <div className="h-4 bg-gray-200 w-5/6 rounded"></div>
                <div className="pl-5 space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-100 w-5/6 rounded"></div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 w-full rounded"></div>
              </div>
            ) : details?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {/* Display paragraphs first */}
                {details?.filter(item => item.type === 'paragraph')?.slice(0, 1)?.map(item => (
                  <p key={item.id} className="text-lg text-gray-700">{item.content}</p>
                ))}

                {/* Display bullets in the middle */}
                {details.filter(item => item.type === 'bullet')?.length > 0 && (
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {details.filter(item => item.type === 'bullet')?.map(item => (
                      <li key={item.id}>{item.content}</li>
                    ))}
                  </ul>
                )}

                {/* Display the rest of paragraphs */}
                {details.filter(item => item.type === 'paragraph')?.slice(1)?.map(item => (
                  <p key={item.id} className="text-lg text-gray-700">{item.content}</p>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <p className="text-lg text-gray-700">
                  Dr. Lehri utilizes the latest technology in ophthalmology to provide precise diagnoses and
                  effective treatments. His clinic features state-of-the-art equipment for comprehensive
                  eye examinations, including:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>High-definition optical coherence tomography (OCT)</li>
                  <li>Advanced corneal topography</li>
                  <li>Digital fundus photography</li>
                  <li>Computerized visual field testing</li>
                  <li>Non-contact tonometry for glaucoma screening</li>
                </ul>
                <p className="text-lg text-gray-700">
                  This advanced technology enables Dr. Lehri to detect eye conditions at their earliest stages,
                  when treatment is most effective and less invasive.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="text-center mt-8 sm:mt-12 pb-8 sm:pb-12 px-4 sm:px-6" data-aos="fade-up">
        <Link
          to="/eyecare/doctor"
          className="w-full sm:w-auto inline-block"
        >
          <Button className="mac-btn eyecare-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-base sm:text-lg max-w-[90%] sm:max-w-none mx-auto">
            Learn More About Dr. Lehri
          </Button>
        </Link>
      </div>









      {/* Why Choose Us Section */}
      {/* <section className="py-20 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div data-aos="fade-right">
                  <h2 
                    className="text-3xl md:text-4xl font-bold mb-6"
                    data-editable="true" 
                    data-selector="eyecare-home-why-choose-h2"
                  >
                    {whyChooseSection?.heading || "Why Choose Our Eye Care Center?"}
                  </h2>
                  <p 
                    className="text-lg text-gray-600 mb-8"
                    data-editable="true" 
                    data-selector="eyecare-home-why-choose-p"
                  >
                    {whyChooseSection?.description || 
                      "We provide comprehensive eye care services with a focus on patient comfort, cutting-edge technology, and personalized treatment plans."}
                  </p>
                  
                  <div className="space-y-4">
                    {whyChooseLoading ? (
                      // Loading state
                      Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse shrink-0 mt-0.5" />
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                        </div>
                      ))
                    ) : features.length > 0 ? (
                      // Dynamic features from database
                      features.map((feature) => (
                        <div key={feature.id} className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-eyecare shrink-0 mt-0.5" />
                          <span 
                            className="text-gray-700"
                            data-editable="true" 
                            data-selector={`eyecare-home-feature-${feature.id}`}
                          >{feature.feature_text}</span>
                        </div>
                      ))
                    ) : (
                      // Fallback static content
                      [
                        "State-of-the-art diagnostic equipment",
                        "Experienced ophthalmologists and staff",
                        "Comprehensive eye examinations",
                        "Advanced surgical procedures",
                        "Personalized treatment plans"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-eyecare shrink-0 mt-0.5" />
                          <span 
                            className="text-gray-700"
                            data-editable="true" 
                            data-selector={`eyecare-home-feature-${index + 1}`}
                          >{item}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <Link to="/eyecare/doctor">
                      <Button 
                        className="mac-btn eyecare-btn"
                        data-editable="true" 
                        data-selector="eyecare-home-meet-doctor-btn"
                      >
                        Meet Dr. Sanjeev Lehri
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div 
                  className="rounded-2xl overflow-hidden shadow-xl" 
                  data-aos="fade-left"
                >
                  {whyChooseLoading ? (
                    <div className="bg-gray-300 animate-pulse w-full h-64 md:h-96"></div>
                  ) : (
                    <img 
                      src={whyChooseSection?.image_url || clinicImage.url} 
                      alt={whyChooseSection?.heading || clinicImage.alt}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      data-editable="true" 
                      data-selector="eyecare-home-clinic-img"
                    />
                  )}
                </div>
              </div>
            </div>
          </section> */}

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-eyecare text-white">
        <div className="container mx-auto max-w-5xl text-center" data-aos="fade-up">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6"
            data-editable="true"
            data-selector="eyecare-home-cta-h2"
          >
            Take the First Step Towards Better Vision
          </h2>
          <p
            className="text-xl mb-8 text-white/90 max-w-3xl mx-auto"
            data-editable="true"
            data-selector="eyecare-home-cta-p"
          >
            Schedule an appointment with Dr. Sanjeev Lehri today and experience
            the difference of personalized, expert care.
          </p>
          <Link to="/eyecare/appointment">
            <Button
              className="mac-btn px-8 py-6 text-lg bg-white text-eyecare hover:bg-white/90 gap-2"
              data-editable="true"
              data-selector="eyecare-home-cta-btn"
            >
              <Calendar className="h-5 w-5" />
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
    </EyeCareLayout>
  );
};

export default EyeCareHome;
