import React, { useState, useEffect } from 'react';
import PublicarOferta from './PublicarOferta';

export default function App() {
  const [produtos, setProdutos] = useState([]);

  // Função para buscar os produtos no backend em nuvem
  const buscarProdutosDoBanco = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const resposta = await fetch(`${apiUrl}/produtos`);
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setProdutos(dados); // Atualiza o estado com os produtos vindos do banco
      }
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    }
  };

  // Dispara a busca assim que o site abre no navegador
  useEffect(() => {
    buscarProdutosDoBanco();
  }, []);

  return (
    <div>
      {/* Passa a função para o botão de publicar recarregar a lista */}
      <PublicarOferta recarregarProdutos={buscarProdutosDoBanco} />

      {/* Renderiza a lista vinda do banco */}
      <div className="produtos-grid">
        {produtos.map((prod) => (
          <div key={prod.id || prod._id} className="card-produto">
            <h3>{prod.nome}</h3>
            <p>R$ {prod.preco}</p>
          </div>
        ))}
      </div>
    </div>
  );
}