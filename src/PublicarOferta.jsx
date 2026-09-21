const API_URL = import.meta.env.VITE_API_URL || 'https://ofertas-backend-chge.onrender.com';

const resposta = await fetch(`${API_URL}/produtos`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(novoProduto),
});