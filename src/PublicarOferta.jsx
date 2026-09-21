import React, { useState } from 'react';

export default function PublicarOferta({ recarregarProdutos }) {
  const [novoProduto, setNovoProduto] = useState({ nome: '', preco: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const resposta = await fetch(`${apiUrl}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
      });

      if (resposta.ok) {
        alert("Produto cadastrado com sucesso!");
        
        if (recarregarProdutos) {
          recarregarProdutos();
        }
      }
    } catch (erro) {
      console.error("Erro ao publicar oferta:", erro);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Seus campos de input aqui */}
      <button type="submit">Cadastrar Produto</button>
    </form>
  );
}