import React, { useState, useEffect } from 'react';
import PublicarOferta from './PublicarOferta';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const buscarProdutosDoBanco = async () => {
    try {
      setCarregando(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const resposta = await fetch(`${apiUrl}/produtos`);
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setProdutos(dados);
      }
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarProdutosDoBanco();
  }, []);

  return (
    <div>
      <PublicarOferta recarregarProdutos={buscarProdutosDoBanco} />

      {carregando ? (
        <p>Carregando ofertas da nuvem...</p>
      ) : (
        <div className="produtos-grid">
          {produtos.length === 0 ? (
            <p>Nenhuma oferta encontrada no banco de dados.</p>
          ) : (
            produtos.map((prod, index) => (
              <div key={prod.id || index} className="card-produto">
                <h3>{prod.nome}</h3>
                <p>R$ {prod.preco}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}