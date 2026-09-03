import React from "react";

export default function CtaSection() {
  return (
    <section className="py-20 flex items-center justify-center bg-gradient-to-r from-cosy-brown-600 to-cosy-brown-700 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="font-nunito text-5xl md:text-6xl block mb-4">Pronto para começar?</span>
          Sua próxima aventura doce espera por você!
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
          Junte-se a milhares de confeiteiras e amantes de doces que já transformaram
          suas paixões em realidade com o Melfy.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="https://melfy-confeiteira.vercel.app/"
            className="px-8 py-4 bg-mellow-yellow-400 hover:bg-mellow-yellow-500 text-cosy-brown-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            <i className="fas fa-oven mr-2"></i> Quero vender doces
          </a>
          <a
            href="/doces"
            className="px-8 py-4 bg-white hover:bg-gray-100 text-cosy-brown-700 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
          >
            <i className="fas fa-cookie mr-2"></i> Quero comprar doces
          </a>
        </div>
      </div>
    </section>
  );
}
