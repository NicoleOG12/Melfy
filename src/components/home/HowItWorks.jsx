import React from "react";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-cosy-brown-100 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-cosy-brown-700">
            <span className="font-nunito text-5xl md:text-6xl">Como funciona?</span>
            <br />é simples e doce!
          </h2>
          <p className="text-lg md:text-xl text-cosy-brown-600 max-w-2xl mx-auto">
            Cada papel no Melfy tem um jeitinho especial — escolha o seu e descubra como é fácil adoçar o dia!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Confeiteira */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-mellow-yellow-400 p-6 rounded-full mb-6">
              <i className="fas fa-cookie-bite text-4xl text-cosy-brown-700"></i>
            </div>
            <h3 className="text-2xl font-weight-400 text-cosy-brown-700 mb-4 text-center">Para Confeiteiras</h3>
            <p className="text-cosy-brown-600 mb-6 text-center flex-grow">
              Cadastre seus doces, gerencie pedidos e encante seus clientes com facilidade e amor.
            </p>
            <a
              href="https://melfy-confeiteira.vercel.app/"
              className="w-full px-6 py-3 bg-mellow-yellow-400 hover:bg-mellow-yellow-500 text-cosy-brown-700 rounded-full font-bold text-center transition-colors flex items-center justify-center"
            >
              Quero vender meus doces <i className="fas fa-cookie-bite ml-2"></i>
            </a>
          </div>

          {/* Comprador */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-sweet-pink p-6 rounded-full mb-6">
              <i className="fas fa-shopping-bag text-4xl text-white"></i>
            </div>
            <h3 className="text-2xl font-weight-400 text-cosy-brown-700 mb-4 text-center">Para Compradores</h3>
            <p className="text-cosy-brown-600 mb-6 text-center flex-grow">
              Encontre os melhores doces da sua região e faça pedidos com apenas alguns cliques.
            </p>
            <a
              href="/auth"
              className="w-full px-6 py-3 bg-sweet-pink hover:bg-pink-300 text-white rounded-full font-bold text-center transition-colors flex items-center justify-center"
            >
              Quero saborear <i className="fas fa-heart ml-2"></i>
            </a>
          </div>

          {/* Entregador */}
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-mellow-yellow-500 p-6 rounded-full mb-6">
              <i className="fas fa-motorcycle text-4xl text-cosy-brown-700"></i>
            </div>
            <h3 className="text-2xl font-weight-400 text-cosy-brown-700 mb-4 text-center">Para Entregadores</h3>
            <p className="text-cosy-brown-600 mb-6 text-center flex-grow">
              Conecte-se com confeiteiras próximas e garanta entregas rápidas e seguras.
            </p>
            <a
              href="https://melfy-entregador.vercel.app/"
              className="w-full px-6 py-3 bg-mellow-yellow-500 hover:bg-mellow-yellow-600 text-cosy-brown-700 rounded-full font-bold text-center transition-colors flex items-center justify-center"
            >
              Quero entregar <i className="fas fa-motorcycle ml-2"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
