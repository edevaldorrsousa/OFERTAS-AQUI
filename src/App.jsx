import React, { useState, useEffect } from 'react';
import PublicarOferta from './PublicarOferta';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // URL do backend no Render (com fallback direto)
  const API_URL = import.meta.env.VITE_API_URL || 'https://ofertas-backend-chge.onrender.com';

  // Função para buscar os produtos no servidor na nuvem
  const buscarProdutosDoBanco = async () => {
    try {
      setCarregando(true);
      const resposta = await fetch(`${API_URL}/produtos`);
      
      if (resposta.ok) {
        const dados = await resposta.json();
        setProdutos(dados);
      } else {
        console.error("Erro na resposta do servidor:", resposta.status);
      }
    } catch (erro) {
      console.error("Erro ao conectar à API do Render:", erro);
    } finally {
      setCarregando(false);
    }
  };

  // Carrega os produtos assim que a página é aberta
  useEffect(() => {
    buscarProdutosDoBanco();
  }, []);

  return (
    <div className="app-container">
      {/* Passa a função para recarregar a lista quando uma nova oferta for publicada */}
      <PublicarOferta recarregarProdutos={buscarProdutosDoBanco} />

      <main className="conteudo-principal">
        <h2>Ofertas em Destaque</h2>

        {carregando ? (
          <p>A carregar ofertas da nuvem...</p>
        ) : produtos.length === 0 ? (
          <p>Nenhuma oferta encontrada no banco de dados.</p>
        ) : (
          <div className="produtos-grid">
            {produtos.map((prod, index) => (
              <div key={prod.id || prod._id || index} className="card-produto">
                {prod.imagemUrl && (
                  <img src={prod.imagemUrl} alt={prod.nome} className="imagem-produto" />
                )}
                <h3>{prod.nome}</h3>
                <p className="preco">R$ {prod.preco}</p>
                {prod.cidade && <p className="cidade">📍 {prod.cidade}</p>}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}