import React from "react";

export default function HeroSection() {
  return (
    <section className="min-h-[75vh] flex items-center justify-center bg-[#4A2014] relative overflow-hidden px-10 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between w-full">
        <div className="md:w-1/2 text-left space-y-6 text-[#FAEBD7] md:pl-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="font-nunito text-6xl md:text-7xl block mb-2 text-[#FFE8B6]">
              Doces feitos
            </span>
            <span className="relative inline-block">
              <span className="relative z-10 text-[#FFFFFF]">com amor</span>
              <span className="absolute bottom-0 left-0 w-full h-4 bg-[#FFD166] z-0 opacity-40 rounded"></span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-[#F5D1A3]">
            Conectamos confeiteiras talentosas a amantes de doces em todo o Brasil.
            Seu próximo doce favorito está a um clique de distância!
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <a
              href="/doces"
              className="px-8 py-4 bg-[#FFD166] hover:bg-[#FDCB58] text-[#4A2014] rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              <i className="fas fa-cookie mr-2"></i> Encomendar doces
            </a>
            <a
              href="https://melfy-confeiteira.vercel.app/"
              className="px-8 py-4 border-2 border-[#F5D1A3] hover:bg-[#F5D1A3] hover:text-[#3B160C] text-[#F5D1A3] rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              <i className="fas fa-oven mr-2"></i> Vender no Melfy
            </a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center relative mt-12 md:mt-0">
          <img
            src="/assents/img/Home/bolo.svg"
            alt="Bolo de chocolate"
            className="max-w-sm md:max-w-md drop-shadow-2xl animate-float"
          />
        </div>
      </div>
    </section>
  );
}
