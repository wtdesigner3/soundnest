"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Header from "./Header";
import HeroSlider from "./HeroSlider";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import BrandsMarquee from "./BrandsMarquee";
import TestimonialsSection from "./TestimonialsSection";
import CtaBanner from "./CtaBanner";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import ConsultationModal from "./ConsultationModal";
import FloatingActions from "./FloatingActions";

export default function HomeClient({ initialData }) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // SEO-friendly, performance-oriented engagement animations
      // We animate position/scale while preserving 100% text opacity for search engine indexing and immediate visibility

      // 1. About Section reveal
      gsap.fromTo(
        "#about-us .about-animate",
        { y: 30 },
        {
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#about-us",
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );

      // 2. Services cards stagger
      gsap.fromTo(
        "#services article",
        { y: 35 },
        {
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#services",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 3. Testimonials cards stagger
      gsap.fromTo(
        "#testimonials [class*='card']",
        { y: 30 },
        {
          y: 0,
          duration: 0.75,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#testimonials",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 4. Contact section reveal
      gsap.fromTo(
        "#contact .contact-animate",
        { y: 25 },
        {
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#contact",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // 5. Parallax scroll effect on CTA Banner
      const ctaBg = document.querySelector("#cta-banner-bg");
      if (ctaBg) {
        gsap.to(ctaBg, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: "#cta-banner",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      ScrollTrigger.refresh();
    }, mainRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={mainRef} className="soundnest-home-wrapper">
      {/* Top Header */}
      <Header onOpenConsultation={() => setIsConsultationOpen(true)} />

      <main id="main-content">
        {/* Hero Section with Slider & Consultation Form */}
        <HeroSlider
          onOpenConsultation={() => setIsConsultationOpen(true)}
          slides={initialData?.heroSlides}
        />

        {/* About Us Section */}
        <AboutSection
          onOpenConsultation={() => setIsConsultationOpen(true)}
          data={initialData?.aboutData}
        />

        {/* Services Showcase */}
        <ServicesSection data={initialData?.servicesData} />

        {/* Brands Carousel / Marquee */}
        <BrandsMarquee brands={initialData?.brandsList} />

        {/* Testimonials */}
        <TestimonialsSection data={initialData?.testimonialsData} />

        {/* Parallax CTA Banner */}
        <CtaBanner
          onOpenConsultation={() => setIsConsultationOpen(true)}
          data={initialData?.ctaBannerData}
        />

        {/* Contact Us Section with Demo Visual */}
        <ContactSection data={initialData?.contactSectionData} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <FloatingActions />

      {/* Consultation Dialog Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </div>
  );
}
