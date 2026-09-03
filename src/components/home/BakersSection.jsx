import React, { useState, useEffect } from "react";
import { fetchLojas } from "../../services/api";

export default function BakersSection() {
  const [lojas,   setLojas]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLojas()
      .then(setLojas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="bakers" className="py-20 bg-mellow-yellow-100 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-cosy-brown-700">
            <span className="font-nunito text-5xl md:text-6xl">Confeitarias em destaque</span>
            <br />feitas com amor e muito sabor!
          </h2>
          <p className="text-xl text-cosy-brown-600 max-w-2xl mx-auto">
            Conheça algumas das confeitarias que adoçam o Melfy com seus doces irresistíveis 💛
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            <p className="text-center col-span-full py-8">Carregando confeitarias…</p>
          )}
          {!loading && lojas.length === 0 && (
            <p className="text-center col-span-full py-8">Nenhuma confeitaria encontrada.</p>
          )}
          {lojas.slice(0, 3).map((loja) => (
            <div
              key={loja.id_loja || loja.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={loja.pfp} alt={loja.nome} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{loja.nome}</h3>
                  <div className="flex items-center mt-1">
                    <i className="fas fa-star text-mellow-yellow-400 mr-1"></i>
                    <span>
                      4.{Math.floor(Math.random() * 9)} (
                      {Math.floor(Math.random() * 100) + 50} avaliações)
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-cosy-brown-600 mb-6 flex-grow">
                  {loja.descricao || "Confeitaria artesanal especializada em doces finos e personalizados."}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="text-cosy-brown-700 font-bold">
                    {loja.cidade || "São Paulo"}, {loja.estado || "SP"}
                  </span>
                  <a
                    href="#"
                    className="px-4 py-2 bg-mellow-yellow-400 hover:bg-mellow-yellow-500 text-cosy-brown-700 rounded-full font-bold text-sm transition-colors flex items-center"
                  >
                    Ver doces <i className="fas fa-arrow-right ml-1"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
