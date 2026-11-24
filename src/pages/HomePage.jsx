import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import ProductsSection from "../components/home/ProductsSection";
import OffersSection from "../components/home/OffersSection";
import HowItWorks from "../components/home/HowItWorks";
import BakersSection from "../components/home/BakersSection";
import CtaSection from "../components/home/CtaSection";
import "../styles/home.css";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="bg-mellow-yellow-100 font-nunito text-cosy-brown-700">
        <HeroSection />
        <ProductsSection />
        <OffersSection />
        <HowItWorks />
        <BakersSection />
        <CtaSection />
      </div>
      <Footer />
    </>
  );
}
