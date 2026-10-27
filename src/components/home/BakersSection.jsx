import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLojasMaisProximas } from "../../hooks/useLojasMaisProximas";

export default function BakersSection() {
  const { lojas } = useLojasMaisProximas();
  const loading = lojas.length === 0;
  const navigate = useNavigate();

  const avaliacoes = useRef([]);

  useEffect(() => {
    if (lojas.length > 0 && avaliacoes.current.length === 0) {
      avaliacoes.current = lojas.map(() => ({
        nota: (4 + Math.random()).toFixed(1),
        total: Math.floor(Math.random() * 100) + 50,
      }));
    }
  }, [lojas]);

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
          {!loading && lojas.slice(0, 3).map((loja, i) => {
            const id   = loja.id_loja || loja.id;
            const nome = loja.nome_loja || loja.nome;
            const foto = loja.foto_loja || loja.pfp;
            const av   = avaliacoes.current[i] ?? { nota: "4.5", total: 80 };

            return (
              <div
                key={id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full cursor-pointer"
                onClick={() => navigate(`/loja/${id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={foto} alt={nome} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{nome}</h3>
                    <div className="flex items-center mt-1">
                      <i className="fas fa-star text-mellow-yellow-400 mr-1"></i>
                      <span>{av.nota} ({av.total} avaliações)</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-cosy-brown-600 mb-6 flex-grow">
                    {loja.descricao || "Confeitaria artesanal especializada em doces finos e personalizados."}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    {loja.distKm !== undefined && loja.distKm !== Infinity ? (
                      <span className="text-cosy-brown-500 text-sm flex items-center gap-1">
                        <i className="fas fa-map-marker-alt"></i>
                        {loja.distKm < 1 ? `${Math.round(loja.distKm * 1000)} m` : `${loja.distKm.toFixed(1)} km`} de você
                      </span>
                    ) : (
                      <span />
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); navigate(`/loja/${id}`); }}
                      className="px-4 py-2 bg-mellow-yellow-400 hover:bg-mellow-yellow-500 text-cosy-brown-700 rounded-full font-bold text-sm transition-colors flex items-center"
                    >
                      Ver doces <i className="fas fa-arrow-right ml-1"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
