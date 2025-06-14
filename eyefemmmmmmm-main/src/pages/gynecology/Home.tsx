import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  MoveRight,
  Star,
  Smile,
  UserPlus,
  Clock,
  Calendar,
  Users,
  Heart,
} from "lucide-react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDoctorTreatments } from "@/hooks/useDoctorTreatments";
import GynecologyLayout from "@/components/GynecologyLayout";
import { useGynecologyServices } from "@/hooks/useGynecologyServices";
import { useFertilityTreatments } from "@/hooks/useFertilityTreatments";
import { useDoctorWhyChoose } from "@/hooks/useDoctorWhyChoose";
import { useServiceHighlights } from "@/hooks/useServiceHighlights";
import { useGyneAdvancedProcedures } from "@/hooks/useGyneAdvancedProcedures";

interface FormattedDescription {
  introText: string;
  bulletPoints: string[];
  conclusionText: string;
}

interface ProcedureData {
  title: string;
  subtitle: string;
  description: string;
}

const GynecologyHome = () => {
  const formatDescription = (description: string): FormattedDescription => {
    if (!description) {
      return {
        introText: "",
        bulletPoints: [],
        conclusionText: ""
      };
    }
    
    const parts = description.split(/•/g);
    const introText = parts[0].trim();
    const bulletPoints = parts.slice(1).map(part => part.trim()).filter(part => part);
    
    let conclusionText = "";
    if (bulletPoints.length > 0) {
      const lastItem = bulletPoints[bulletPoints.length - 1];
      const conclusionSplit = lastItem.split('\n');
      if (conclusionSplit.length > 1) {
        const lastBullet = conclusionSplit[0];
        conclusionText = conclusionSplit.slice(1).join('\n').trim();
        bulletPoints[bulletPoints.length - 1] = lastBullet;
      }
    }
    
    return { introText, bulletPoints, conclusionText };
  };

  const { procedure, isLoading: isProcLoading, error: procError } = useGyneAdvancedProcedures();

  const procedureData: ProcedureData = procedure || {
    title: "Advanced Procedures",
    subtitle: "Dr. Bhatnagar specializes in advanced gynecological procedures using cutting-edge technology",
    description: "Dr. Bhatnagar utilizes the latest technology in gynecology to provide precise diagnoses and effective treatments. Her clinic features state-of-the-art equipment including:\n• 4D Ultrasound imaging for detailed fetal assessment\n• Hysteroscopy for minimally invasive diagnosis and treatment\n• Advanced IVF laboratory equipment\n• Laparoscopic surgery tools for minimally invasive procedures\n• Colposcopy for detailed cervical examination\nThese advanced technologies enable Dr. Bhatnagar to provide the highest standard of care while minimizing discomfort and recovery time for her patients."
  };

  const formattedProcedure = formatDescription(procedureData.description);

  const getImageForTreatment = (title: string) => {
    if (title.includes("IVF")) {
      return "/eyefemm_pic_uploads/519353d5-cc84-4d60-b215-a3bcf0f6db39.jpg";
    } else if (title.includes("IUI")) {
      return "/eyefemm_pic_uploads/47a70484-57b8-4968-839f-3f81f98e326f.jpg";
    } else if (title.includes("Hysteroscopy")) {
      return "/eyefemm_pic_uploads/bf3365de-daab-4d50-a8ca-410647e0995b.jpg";
    } else if (title.includes("Laparoscopic")) {
      return "/eyefemm_pic_uploads/bc65b119-7b9f-48c1-8ff3-16aee3475f1c.jpg";
    } else if (title.includes("High Risk") || title.includes("Pregnancy")) {
      return "/eyefemm_pic_uploads/c9f8cc79-a746-4d28-bcc9-eb05cac776e2.jpg";
    }
    // Default image
    return "/eyefemm_pic_uploads/519353d5-cc84-4d60-b215-a3bcf0f6db39.jpg";
  };
  const { treatments, isLoading: isTreatmentsLoading } = useDoctorTreatments();
  const [activeTab, setActiveTab] = useState("ivf");
  const { services, isLoading } = useGynecologyServices();
  const { fertilityData, isLoading: isFertilityLoading } =
    useFertilityTreatments();
  const { choices, isLoading: isChoicesLoading } = useDoctorWhyChoose();
  const { highlights, isLoading: highlightsLoading } = useServiceHighlights();

  // Get the hero section data (assuming the first highlight is used for the hero)
  const heroData = highlights?.length > 0 ? highlights[0] : null;

  useEffect(() => {
    if (treatments.length > 0) {
      setActiveTab(treatments[0].id);
    }
  }, [treatments]);

  return (
    <GynecologyLayout>
      <div className="flex flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
          <section className="relative bg-gradient-gynecology text-white py-8 sm:py-12 md:py-16 lg:py-20">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Text Content */}
                <div data-aos="fade-right">
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
                    data-editable="true"
                    data-selector="gyne-home-h1"
                  >
                    {heroData?.title || "Women's Health & Fertility Care"}
                  </h1>
                  <p
                    className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90"
                    data-editable="true"
                    data-selector="gyne-home-hero-p"
                  >
                    {heroData?.description ||
                      "Comprehensive gynecological and fertility services with personalized care by Dr. Nisha Bhatnagar."}
                  </p>
                  <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4">
                    <Link
                      to="/gynecology/appointment"
                      className="w-full sm:w-auto"
                    >
                      <Button
                        className="mac-btn bg-white text-gynecology hover:bg-white/90 w-full sm:w-auto text-xs sm:text-sm md:text-base px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3"
                        data-editable="true"
                        data-selector="gyne-home-button-1"
                      >
                        Book an Appointment
                      </Button>
                    </Link>
                    <Link to="/gynecology/health" className="w-full sm:w-auto">
                      <Button
                        className="mac-btn bg-transparent border border-white text-white hover:bg-white/10 w-full sm:w-auto text-xs sm:text-sm md:text-base px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3"
                        data-editable="true"
                        data-selector="gyne-home-button-2"
                      >
                        Women's Health Issues
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div
                  className="rounded-2xl overflow-hidden shadow-xl"
                  data-aos="fade-left"
                >
                  <img
                    alt="Women's Healthcare"
                    src={
                      heroData?.image_url ||
                      "https://www.twiniversity.com/wp-content/uploads/2018/07/featured-1024x1024.png"
                    }
                    className="w-full h-full object-cover"
                    loading="eager"
                    data-editable="true"
                    data-selector="gyne-home-hero-img"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
              <div
                className="text-center mb-10 sm:mb-12 md:mb-16"
                data-aos="fade-up"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                  Common Women's Problems we treat
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  We offer comprehensive care for all aspects of women's health,
                  from routine check-ups to specialized fertility treatments.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {isLoading
                  ? // Display loading placeholders
                  [...Array(6)].map((_, index) => (
                    <div
                      key={index}
                      className="glass-card rounded-xl p-5 sm:p-6 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-16 bg-gray-100 rounded"></div>
                    </div>
                  ))
                  : services.length > 0
                    ? services.map((service, index) => (
                      <div
                        key={service.id}
                        className="glass-card rounded-xl p-5 sm:p-6 hover:shadow-lg transition-shadow h-full"
                        data-aos="fade-up"
                        data-aos-delay={100 * (index + 1)}
                      >
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gynecology">
                          {service.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    ))
                    : // Fallback data if no services are available
                    [
                      {
                        title: "General Gynecology",
                        description:
                          "Comprehensive care for all aspects of women's health, including routine check-ups and preventive care.",
                        delay: 100,
                      },
                      {
                        title: "Fertility Treatments",
                        description:
                          "Advanced fertility services including IVF, IUI, and other assisted reproductive technologies.",
                        delay: 200,
                      },
                      {
                        title: "Obstetric Care",
                        description:
                          "Complete prenatal, delivery, and postnatal care for expectant mothers.",
                        delay: 300,
                      },
                      {
                        title: "Menopause Management",
                        description:
                          "Specialized care to help women navigate the physical and emotional changes of menopause.",
                        delay: 400,
                      },
                      {
                        title: "Gynecological Surgery",
                        description:
                          "Minimally invasive surgical procedures for various gynecological conditions.",
                        delay: 500,
                      },
                      {
                        title: "PCOS Treatment",
                        description:
                          "Comprehensive management of Polycystic Ovary Syndrome and related hormonal disorders.",
                        delay: 600,
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
                        data-aos="fade-up"
                        data-aos-delay={item.delay}
                      >
                        <h3 className="text-xl font-bold mb-3 text-gynecology">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    ))}
              </div>

              <div className="text-center mt-12" data-aos="fade-up">
                <Link
                  to="/gynecology/health"
                  className="hidden items-center justify-center text-sm sm:text-base font-medium text-center text-white bg-gynecology hover:bg-gynecology/90 focus:ring-4 focus:outline-none focus:ring-pink-300 rounded-lg px-5 py-2.5 transition-colors duration-200"
                >
                  Explore all women's health services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          <section className="py-8 px-0 sm:px-4">
            <div className="container mx-auto max-w-6xl">
              {isTreatmentsLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-gynecology mb-4" />
                  <p className="text-gray-500 text-lg">Loading treatments...</p>
                </div>
              ) : treatments.length > 0 ? (
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  defaultValue={treatments[0]?.id || "ivf"}
                  className="w-full"
                >
                  <div className="text-center mb-6 sm:mb-8 md:mb-10" data-aos="fade-up">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6 text-gynecology">
                      Gynecology Services &amp; Treatments
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                      Comprehensive gynecological and fertility services to help you achieve your health goals.
                    </p>
                  </div>
                  <div className="flex items-center mb-4 sm:mb-6 md:mb-8 relative overflow-hidden">
                    {/* Mobile scroll indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent sm:hidden"></div>

                    <div
                      className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mx-auto flex-grow py-2 px-3 sm:px-6 -mx-2 sm:mx-0"
                    >
                      <TabsList className="bg-gray-100 flex space-x-1 sm:space-x-2 p-1.5 h-auto w-max min-w-full justify-start sm:justify-center rounded-full shadow-sm">
                        {treatments.map(treatment => (
                          <TabsTrigger
                            key={treatment.id}
                            value={treatment.id}
                            className="px-4 sm:px-5 py-2.5 rounded-full data-[state=active]:bg-gynecology data-[state=active]:text-white data-[state=active]:shadow-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gynecology/50 transition-all"
                          >
                            {treatment.title.split('(')[0].trim()}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                  </div>

                  {treatments.map(treatment => (
                    <TabsContent key={treatment.id} value={treatment.id} className="mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="order-2 md:order-1">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gynecology">{treatment.title}</h2>
                          <p className="text-sm sm:text-base text-gray-700 mb-5">
                            {treatment.description}
                          </p>

                          <div className="space-y-4 sm:space-y-6">
                            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                              <div className="flex items-center mb-3">
                                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-pink-100 text-gynecology mr-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                    <path d="m9 12 2 2 4-4"></path>
                                  </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gynecology">
                                  {treatment.title.includes("IVF")
                                    ? "Our IVF Services Include:"
                                    : treatment.title.includes("IUI")
                                      ? "When IUI is Recommended:"
                                      : treatment.title.includes("Hysteroscopy")
                                        ? "Common Conditions Treated:"
                                        : treatment.title.includes("Laparoscopic")
                                          ? "Our Laparoscopic Services:"
                                          : "We Specialize in Managing:"}
                                </h3>
                              </div>

                              <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                                {treatment.bullet_points.map((point, index) => (
                                  <li key={index}>{point.replace('• ', '')}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-6">
                            <Link to="/gynecology/appointment" className="w-full sm:w-auto inline-block">
                              <Button className="mac-btn gynecology-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3">
                                {treatment.button_text}
                              </Button>
                            </Link>
                          </div>
                        </div>

                        <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                          <div className="flex items-center justify-center h-80 w-full">
                            <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md h-80">
                              <img
                                alt={`${treatment.title} Treatment`}
                                className="w-full h-full object-cover"
                                src={treatment.image_url || getImageForTreatment(treatment.title)}
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.src = getImageForTreatment(treatment.title);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <Tabs defaultValue="ivf" className="w-full">
                  <div className="text-center mb-6 sm:mb-8 md:mb-10" data-aos="fade-up">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6 text-gynecology">
                      Gynecology Services &amp; Treatments
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                      Comprehensive gynecological and fertility services to help you achieve your health goals.
                    </p>
                  </div>

                  <div className="flex items-center mb-4 sm:mb-6 md:mb-8 relative overflow-hidden">
                    {/* Mobile scroll indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent sm:hidden"></div>

                    <div
                      className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mx-auto flex-grow py-2 px-3 sm:px-6 -mx-2 sm:mx-0"
                    >
                      <TabsList className="bg-gray-100 flex space-x-1 sm:space-x-2 p-1.5 h-auto w-max min-w-full justify-start sm:justify-center rounded-full shadow-sm">
                        {[
                          { id: "ivf", label: "IVF" },
                          { id: "iui", label: "IUI" },
                          { id: "hysteroscopy", label: "Hysteroscopy" },
                          { id: "laparoscopy", label: "Laparoscopy" },
                          { id: "pregnancy", label: "Pregnancy" }
                        ].map((item) => (
                          <TabsTrigger
                            key={item.id}
                            value={item.id}
                            className="px-4 sm:px-5 py-2.5 rounded-full data-[state=active]:bg-gynecology data-[state=active]:text-white data-[state=active]:shadow-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gynecology/50 transition-all"
                          >
                            {item.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </div>
                  </div>

                  <TabsContent value="ivf" className="mt-6 sm:mt-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="w-full h-1 bg-gynecology"></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                          <div className="flex items-center justify-center h-80 w-full">
                            <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md h-80">
                              <img
                                alt="IVF Treatment"
                                className="w-full h-full object-cover"
                                src="/eyefemm_pic_uploads/519353d5-cc84-4d60-b215-a3bcf0f6db39.jpg"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="order-2 md:order-1 p-5 sm:p-6 md:p-8">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gynecology">In Vitro Fertilization (IVF)</h2>
                          <p className="text-sm sm:text-base text-gray-700 mb-5">
                            IVF is an advanced fertility treatment that helps couples achieve pregnancy
                            when other methods have been unsuccessful. Our state-of-the-art facility
                            provides comprehensive IVF care with high success rates.
                          </p>

                          <div className="mb-6">
                            <div className="flex items-center mb-3">
                              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-pink-100 text-gynecology mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                  <path d="m9 12 2 2 4-4"></path>
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gynecology">Our IVF Services Include:</h3>
                            </div>

                            <ul className="list-disc pl-10 space-y-1 text-gray-700 text-sm sm:text-base">
                              <li>Controlled Ovarian Stimulation</li>
                              <li>Egg Retrieval</li>
                              <li>Sperm Processing</li>
                              <li>Embryo Culture and Transfer</li>
                              <li>Blastocyst Culture</li>
                              <li>Embryo Freezing</li>
                              <li>Genetic Testing Options</li>
                            </ul>
                          </div>

                          <div>
                            <Link to="/gynecology/appointment" className="w-full sm:w-auto inline-block">
                              <Button className="mac-btn gynecology-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3">
                                Schedule IVF Consultation
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>


                  <TabsContent value="hysteroscopy" className="mt-6 sm:mt-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="w-full h-1 bg-gynecology"></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                          <div className="flex items-center justify-center h-80 w-full">
                            <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md h-80">
                              <img
                                alt="Hysteroscopy Procedure"
                                className="w-full h-full object-cover"
                                src="/eyefemm_pic_uploads/bf3365de-daab-4d50-a8ca-410647e0995b.jpg"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="order-2 md:order-1 p-5 sm:p-6 md:p-8">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gynecology">Hysteroscopy</h2>
                          <p className="text-sm sm:text-base text-gray-700 mb-5">
                            Hysteroscopy is a minimally invasive procedure that allows
                            direct visualization of the uterine cavity. It's both diagnostic
                            and therapeutic, enabling us to identify and treat various
                            uterine conditions.
                          </p>

                          <div className="mb-6">
                            <div className="flex items-center mb-3">
                              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-pink-100 text-gynecology mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                  <path d="m9 12 2 2 4-4"></path>
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gynecology">Common Conditions Treated:</h3>
                            </div>

                            <ul className="list-disc pl-10 space-y-1 text-gray-700 text-sm sm:text-base">
                              <li>Uterine Polyps</li>
                              <li>Submucous Fibroids</li>
                              <li>Uterine Septum</li>
                              <li>Adhesions (Ashermans Syndrome)</li>
                              <li>Abnormal Uterine Bleeding</li>
                              <li>Recurrent Pregnancy Loss</li>
                            </ul>
                          </div>

                          <div>
                            <Link to="/gynecology/appointment" className="w-full sm:w-auto inline-block">
                              <Button className="mac-btn gynecology-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3">
                                Schedule Consultation
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="iui" className="mt-6 sm:mt-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="w-full h-1 bg-gynecology"></div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        <div className="flex justify-center items-center order-1 md:order-2 mb-6 md:mb-0">
                          <div className="flex items-center justify-center h-80 w-full">
                            <div className="rounded-xl overflow-hidden shadow-lg w-full max-w-md h-80">
                              <img
                                alt="IUI Treatment"
                                className="w-full h-full object-cover"
                                src="/eyefemm_pic_uploads/47a70484-57b8-4968-839f-3f81f98e326f.jpg"
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="order-2 md:order-1 p-5 sm:p-6 md:p-8">
                          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-gynecology">Intrauterine Insemination (IUI)</h2>
                          <p className="text-sm sm:text-base text-gray-700 mb-5">
                            IUI is a fertility treatment that involves placing sperm directly into a woman's uterus
                            to facilitate fertilization. The goal is to increase the number of sperm that reach the
                            fallopian tubes and subsequently increase the chance of fertilization.
                          </p>

                          <div className="mb-6">
                            <div className="flex items-center mb-3">
                              <div className="flex justify-center items-center w-8 h-8 rounded-full bg-pink-100 text-gynecology mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                  <path d="m9 12 2 2 4-4"></path>
                                </svg>
                              </div>
                              <h3 className="text-lg font-semibold text-gynecology">When IUI is Recommended:</h3>
                            </div>

                            <ul className="list-disc pl-10 space-y-1 text-gray-700 text-sm sm:text-base">
                              <li>Unexplained Infertility</li>
                              <li>Mild Male Factor Infertility</li>
                              <li>Cervical Factor Infertility</li>
                              <li>Mild Endometriosis</li>
                              <li>Ovulatory Disorders</li>
                              <li>Use of Donor Sperm</li>
                            </ul>
                          </div>

                          <div>
                            <Link to="/gynecology/appointment" className="w-full sm:w-auto inline-block">
                              <Button className="mac-btn gynecology-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3">
                                Schedule IUI Consultation
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Other static tabs (laparoscopy, pregnancy) would follow the same pattern */}
                </Tabs>
              )}
            </div>
          </section>

          {/* Advanced Procedures Section - Dynamically loaded from procedureData */}
          <section className="py-10 sm:py-12 md:py-16 px-4 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-8 sm:mb-10 md:mb-12" data-aos="fade-up">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-6 text-gynecology">
                  {procedureData.title}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                  {procedureData.subtitle}
                </p>
              </div>

              {isProcLoading ? (
                <div className="flex justify-center items-center py-8 sm:py-10 md:py-12">
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin text-gynecology" />
                    <p className="mt-3 sm:mt-4 text-gray-600 font-medium text-sm sm:text-base">Loading advanced procedures...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                    <img
                      src={procedure?.image_url || "/eyefemm_pic_uploads/0716c0a3-c007-438d-8ef0-5fbe8d302c42.png"}
                      alt="Advanced gynecological procedure"
                      className="w-full h-56 sm:h-64 md:h-72 object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/eyefemm_pic_uploads/0716c0a3-c007-438d-8ef0-5fbe8d302c42.png";
                      }}
                    />
                    <div className="p-3 sm:p-4 bg-white">
                      <h3 className="font-bold text-base sm:text-lg text-gynecology">Dr Nisha Bhatnagar</h3>
                      <p className="text-gray-600 text-sm sm:text-base">Uses High-resolution imaging for accurate diagnosis and monitoring</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {formattedProcedure.introText && (
                      <p className="text-base sm:text-lg text-gray-700">
                        {formattedProcedure.introText}
                      </p>
                    )}

                    {formattedProcedure.bulletPoints && formattedProcedure.bulletPoints.length > 0 && (
                      <ul className="list-disc pl-4 sm:pl-5 space-y-1 sm:space-y-2 text-gray-700 text-sm sm:text-base">
                        {formattedProcedure.bulletPoints.map((point, index) => (
                          <li key={index}>{point}</li>
                        ))}
                      </ul>
                    )}

                    {formattedProcedure.conclusionText && (
                      <p className="text-base sm:text-lg text-gray-700">
                        {formattedProcedure.conclusionText}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-8 sm:mt-12" data-aos="fade-up">
              <Link
                to="/gynecology/doctor"
                className="w-full sm:w-auto inline-block"
              >
                <Button className="mac-btn gynecology-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3">
                  Learn More About Dr. Bhatnagar
                </Button>
              </Link>
            </div>
          </section>


          {/* Fertility Section */}
          {/* <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
            <div className="container mx-auto max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div
                  className="rounded-2xl overflow-hidden shadow-xl mx-auto md:mx-0 max-w-sm sm:max-w-md md:max-w-full mb-6 md:mb-0 order-1 md:order-1"
                  data-aos="fade-right"
                >
                  <img
                    src={
                      fertilityData?.image_url ||
                      "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                    }
                    alt="Fertility Treatment"
                    className="w-full h-64 sm:h-80 md:h-auto object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
                    }}
                  />
                </div>

                <div
                  data-aos="fade-left"
                  className="order-2 md:order-2 text-center md:text-left"
                >
                  {isFertilityLoading ? (
                    // Loading state
                    <div className="space-y-4">
                      <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto md:mx-0 animate-pulse"></div>
                      <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                      <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-6 bg-gray-100 rounded animate-pulse"
                          ></div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6 text-gynecology">
                        {fertilityData?.title ||
                          "Advanced Fertility Treatments"}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-8 max-w-xl mx-auto md:mx-0">
                        {fertilityData?.description ||
                          "Our fertility center offers state-of-the-art reproductive technologies and personalized care to help you achieve your family-building goals."}
                      </p>

                      <div className="space-y-3 sm:space-y-4 text-left max-w-lg mx-auto md:mx-0">
                        {(
                          fertilityData?.treatments || [
                            "In Vitro Fertilization (IVF)",
                            "Intrauterine Insemination (IUI)",
                            "Egg and Sperm Freezing",
                            "Preimplantation Genetic Testing",
                            "Donor Egg and Sperm Programs",
                          ]
                        ).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 sm:gap-3"
                          >
                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gynecology shrink-0 mt-0.5" />
                            <span className="text-sm sm:text-base text-gray-700">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="mt-6 sm:mt-8">
                    <Link
                      to="/gynecology/health"
                      className="w-full sm:w-auto inline-block"
                    >
                      <Button className="mac-btn gynecology-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3">
                        Learn More About Fertility Treatments
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* Why Choose Us Section */}
        { /*  <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
              <div
                className="text-center mb-10 sm:mb-12 md:mb-16"
                data-aos="fade-up"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gynecology">
                  Why Choose Dr. Nisha Bhatnagar?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                  Dr. Bhatnagar offers personalized care based on the latest
                  medical advancements in women's health and fertility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {isChoicesLoading
                  ? // Loading state for benefits
                  [...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="glass-card rounded-xl p-5 sm:p-6 animate-pulse"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full mx-auto mb-3 sm:mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4 mx-auto"></div>
                      <div className="h-16 bg-gray-100 rounded"></div>
                    </div>
                  ))
                  : choices.length > 0
                    ? // Dynamic data from the hook
                    choices.map((choice, index) => (
                      <div
                        key={choice.id}
                        className="glass-card rounded-xl p-5 sm:p-6 text-center h-full"
                        data-aos="fade-up"
                        data-aos-delay={(index + 1) * 100}
                      >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gynecology rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          {getIconForChoice(index)}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                          {choice.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600">
                          {choice.description}
                        </p>
                      </div>
                    ))
                    : // Fallback data
                    [
                      {
                        title: "Expert Care",
                        description:
                          "With over 15 years of experience, Dr. Bhatnagar provides expert gynecological and fertility care based on the latest medical research.",
                      },
                      {
                        title: "Personalized Approach",
                        description:
                          "Each patient receives a customized treatment plan tailored to their specific health needs and family-building goals.",
                      },
                      {
                        title: "Advanced Technology",
                        description:
                          "Our clinic features state-of-the-art technology and the latest advancements in women's healthcare and fertility treatments.",
                      },
                    ].map((item, index) => (
                      <div
                        className="glass-card rounded-xl p-6 text-center"
                        data-aos="fade-up"
                        data-aos-delay={(index + 1) * 100}
                        key={index}
                      >
                        <div className="w-16 h-16 bg-gynecology rounded-full flex items-center justify-center mx-auto mb-4">
                          {getIconForChoice(index)}
                        </div>
                        <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    ))}
              </div>

              <div className="text-center mt-8 sm:mt-12" data-aos="fade-up">
                <Link
                  to="/gynecology/doctor"
                  className="w-full sm:w-auto inline-block"
                >
                  <Button className="mac-btn gynecology-btn w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3">
                    Learn More About Dr. Bhatnagar
                  </Button>
                </Link>
              </div>
            </div>
          </section> */}

          {/* CTA Section */}
          <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-gynecology text-white">
            <div
              className="container mx-auto max-w-5xl text-center"
              data-aos="fade-up"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
                Take the First Step Towards Better Health
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90 max-w-3xl mx-auto px-2">
                Schedule an appointment with Dr. Nisha Bhatnagar today and begin
                your journey to improved health and wellness.
              </p>
              <Link
                to="/gynecology/appointment"
                className="w-full sm:w-auto inline-block"
              >
                <Button className="mac-btn px-6 sm:px-8 py-3 sm:py-4 md:py-6 text-base sm:text-lg bg-white text-gynecology hover:bg-white/90 w-full sm:w-auto">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Appointment
                </Button>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </GynecologyLayout>
  );
};

// Helper function to get icons for the choices
const getIconForChoice = (index: number) => {
  const icons = [
    // Hospital/Building icon
    <svg
      key="hospital"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>,
    // Shield/Security icon
    <svg
      key="shield"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>,
    // Lab flask/technology icon
    <svg
      key="flask"
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
      />
    </svg>,
  ];

  return icons[index % icons.length];
};

export default GynecologyHome;
