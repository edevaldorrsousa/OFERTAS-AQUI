import React, { useState } from 'react';

export default function PublicarOferta({ recarregarProdutos }) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [cidade, setCidade] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [carregando, setCarregando] = useState(false);

  // URL do backend no Render com fallback
  const API_URL = import.meta.env.VITE_API_URL || 'https://ofertas-backend-chge.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !preco) {
      alert('Por favor, preencha o nome e o preço!');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          preco: parseFloat(preco),
          cidade,
          imagemUrl,
        }),
      });

      if (resposta.ok) {
        alert('Oferta publicada com sucesso!');
        // Limpa o formulário
        setNome('');
        setPreco('');
        setCidade('');
        setImagemUrl('');

        // Recarrega a lista no App.jsx se a função foi passada
        if (recarregarProdutos) {
          recarregarProdutos();
        }
      } else {
        alert('Erro ao publicar a oferta no servidor.');
      }
    } catch (erro) {
      console.error('Erro na requisição:', erro);
      alert('Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Publicar Nova Oferta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome do Produto:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Preço (R$):</label>
          <input
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Cidade:</label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
        </div>

        <div>
          <label>URL da Imagem:</label>
          <input
            type="url"
            value={imagemUrl}
            onChange={(e) => setImagemUrl(e.target.value)}
          />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? 'A publicar...' : 'Publicar Oferta'}
        </button>
      </form>
    </div>
  );
}