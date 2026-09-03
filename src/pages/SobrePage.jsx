import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AboutHero from "../components/sobre/AboutHero";
import StorySection from "../components/sobre/StorySection";
import ValuesSection from "../components/sobre/ValuesSection";
import TeamSection from "../components/sobre/TeamSection";
import CtaSection from "../components/home/CtaSection";
import { useReveal } from "../hooks/useReveal";
import { useCounters } from "../hooks/useCounters";
import "../styles/layout.css";
import "../styles/sobre.css";

export default function SobrePage() {
  useReveal();
  useCounters();

  return (
    <>
      <Header />
      <AboutHero />
      <StorySection />
      <ValuesSection />
      <TeamSection />
      <CtaSection />
      <Footer />
    </>
  );
}
