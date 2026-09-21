import { useState, useEffect } from "react";
import "./App.css";
import PublicarOferta from "./PublicarOferta";

function App() {
  const [mostrarPublicar, setMostrarPublicar] = useState(false);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("Todas");
  const [cidadeSelecionada, setCidadeSelecionada] = useState("Todas");
  const [termoBusca, setTermoBusca] = useState("");
  const [ordemSelecionada, setOrdemSelecionada] = useState("recentes"); // Novo estado de ordenação
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  
  const IMAGEM_PADRAO = "https://images.unsplash.com/photo-1523275335684-37898b6baf30";
  const CATEGORIAS_VALIDAS = ["CASA", "ALIMENTOS", "ELETRONICOS", "VEICULOS", "DIVERSOS", "OUTROS"];

  function calcularDataExpiracao(dias = 30) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    return data.toISOString();
  }

  const ofertasIniciais = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
      name: "Smart TV 50 polegadas",
      categoria: "ELETRONICOS",
      oldPrice: "R$ 2.499,00",
      price: "R$ 1.899,00",
      numericPrice: 1899.00,
      cidade: "Água Branca - PI",
      endereco: "Av. Principal, 1000 - Centro",
      telefone: "86999991234",
      localizacao: "https://maps.google.com",
      descricao: "Smart TV 4K com Wi-Fi integrado, comandos por voz e garantia de 1 ano direto na loja física.",
      visualizacoes: 42,
      dataExpiracao: calcularDataExpiracao(30)
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
      name: "Tênis esportivo",
      categoria: "DIVERSOS",
      oldPrice: "R$ 399,00",
      price: "R$ 249,90",
      numericPrice: 249.90,
      cidade: "São Pedro do Piauí - PI",
      endereco: "Rua do Comércio, 45 - Centro",
      telefone: "86988885678",
      localizacao: "https://maps.google.com",
      descricao: "Tênis confortável para corrida e caminhada diária. Vários tamanhos disponíveis.",
      visualizacoes: 18,
      dataExpiracao: calcularDataExpiracao(30)
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
      name: "Smartphone",
      categoria: "ELETRONICOS",
      oldPrice: "R$ 1.999,00",
      price: "R$ 1.499,00",
      numericPrice: 1499.00,
      cidade: "Água Branca - PI",
      endereco: "Praça Central, 12",
      telefone: "86977774321",
      localizacao: "https://maps.google.com",
      descricao: "Smartphone com excelente autonomia de bateria, 128GB de armazenamento e câmera tripla.",
      visualizacoes: 65,
      dataExpiracao: calcularDataExpiracao(30)
    }
  ];

  const [ofertas, setOfertas] = useState(() => {
    try {
      const ofertasSalvas = localStorage.getItem("ofertas_aqui_v3");
      if (ofertasSalvas) {
        return JSON.parse(ofertasSalvas);
      }
      const antigo = localStorage.getItem("ofertas_aqui_v2");
      return antigo ? JSON.parse(antigo) : ofertasIniciais;
    } catch (e) {
      return ofertasIniciais;
    }
  });

  const [favoritosIds, setFavoritosIds] = useState(() => {
    try {
      const favoritosSalvos = localStorage.getItem("ofertas_aqui_favoritos");
      return favoritosSalvos ? JSON.parse(favoritosSalvos) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ofertas_aqui_v3", JSON.stringify(ofertas));
  }, [ofertas]);

  useEffect(() => {
    localStorage.setItem("ofertas_aqui_favoritos", JSON.stringify(favoritosIds));
  }, [favoritosIds]);

  // Função auxiliar para converter preço string (ex: "R$ 1.899,00") para número (1899.00)
  function converterPrecoParaNumero(precoStr) {
    if (!precoStr) return 0;
    const limpo = precoStr.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
    return parseFloat(limpo) || 0;
  }

  function adicionarOferta(dadosPublicacao) {
    const novosProdutosFormatados = dadosPublicacao.produtos.map((item, index) => ({
      id: Date.now() + index,
      image: item.foto && item.foto.trim() !== "" ? item.foto : IMAGEM_PADRAO,
      name: item.nome,
      categoria: item.categoria && CATEGORIAS_VALIDAS.includes(item.categoria) ? item.categoria : "OUTROS",
      oldPrice: item.precoNormal ? `R$ ${item.precoNormal}` : "",
      price: `R$ ${item.precoPromocional}`,
      numericPrice: converterPrecoParaNumero(item.precoPromocional),
      cidade: dadosPublicacao.cidade || "Água Branca - PI",
      endereco: dadosPublicacao.endereco || "Não informado",
      telefone: dadosPublicacao.telefone || "Não informado",
      localizacao: dadosPublicacao.localizacao || "",
      descricao: item.descricao || "Sem descrição informada.",
      visualizacoes: 0,
      dataExpiracao: calcularDataExpiracao(30)
    }));

    const listaAtualizada = [...novosProdutosFormatados, ...ofertas];
    setOfertas(listaAtualizada);
    setMostrarPublicar(false);
    alert(`${novosProdutosFormatados.length} produto(s) publicado(s) com sucesso após confirmação do Pix!`);
  }

  function apagarOferta(idParaApagar) {
    if (window.confirm("Tem certeza que deseja remover esta oferta?")) {
      const novasOfertas = ofertas.filter(item => item.id !== idParaApagar);
      setOfertas(novasOfertas);
    }
  }

  function toggleFavorito(produto) {
    if (favoritosIds.includes(produto.id)) {
      setFavoritosIds(favoritosIds.filter(id => id !== produto.id));
    } else {
      setFavoritosIds([...favoritosIds, produto.id]);
    }
  }

  function verDetalhesProduto(produto) {
    const ofertasAtualizadas = ofertas.map(item => {
      if (item.id === produto.id) {
        return { ...item, visualizacoes: (item.visualizacoes || 0) + 1 };
      }
      return item;
    });

    setOfertas(ofertasAtualizadas);
    const produtoAtualizado = ofertasAtualizadas.find(item => item.id === produto.id);
    setProdutoSelecionado(produtoAtualizado);
  }

  function partilharProduto(produto) {
    const textoPartilha = `🔥 Confira esta oferta no Ofertas Aqui!\n\n*${produto.name}* por apenas *${produto.price}* (${produto.cidade}).\n${produto.descricao}\n\nSaiba mais em: ${window.location.href}`;

    if (navigator.share) {
      navigator.share({
        title: produto.name,
        text: textoPartilha,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textoPartilha);
      alert("Link e detalhes copiados para a área de transferência!");
    }
  }

  const cidadesDisponiveis = ["Todas", ...new Set(ofertas.map(prod => prod.cidade).filter(Boolean))];

  const agora = new Date();
  const ofertasAtivas = ofertas.filter(prod => {
    if (!prod.dataExpiracao) return true;
    return new Date(prod.dataExpiracao) > agora;
  });

  const listaBase = mostrarFavoritos 
    ? ofertasAtivas.filter(prod => favoritosIds.includes(prod.id))
    : ofertasAtivas;

  // Filtragem
  const ofertasFiltradas = listaBase.filter(prod => {
    const combinaCategoria = categoriaSelecionada === "Todas" || prod.categoria === categoriaSelecionada;
    const combinaCidade = cidadeSelecionada === "Todas" || prod.cidade === cidadeSelecionada;
    const combinaBusca = prod.name.toLowerCase().includes(termoBusca.toLowerCase()) || 
                         prod.descricao.toLowerCase().includes(termoBusca.toLowerCase());
    return combinaCategoria && combinaCidade && combinaBusca;
  });

  // Ordenação
  const ofertasOrdenadas = [...ofertasFiltradas].sort((a, b) => {
    if (ordemSelecionada === "menor-preco") {
      const precoA = a.numericPrice !== undefined ? a.numericPrice : converterPrecoParaNumero(a.price);
      const precoB = b.numericPrice !== undefined ? b.numericPrice : converterPrecoParaNumero(b.price);
      return precoA - precoB;
    }
    if (ordemSelecionada === "maior-preco") {
      const precoA = a.numericPrice !== undefined ? a.numericPrice : converterPrecoParaNumero(a.price);
      const precoB = b.numericPrice !== undefined ? b.numericPrice : converterPrecoParaNumero(b.price);
      return precoB - precoA;
    }
    // "recentes" (padrão por ID decrescente)
    return b.id - a.id;
  });

  if (mostrarPublicar) {
    return (
      <PublicarOferta
        voltar={() => setMostrarPublicar(false)}
        aoPublicar={adicionarOferta}
      />
    );
  }

  if (mostrarAdmin) {
    return (
      <div className="app">
        <header className="header">
          <div className="container header-content">
            <div className="logo" onClick={() => setMostrarAdmin(false)} style={{ cursor: "pointer" }}>
              🔥 Ofertas Aqui - Painel Admin
            </div>
            <nav>
              <button className="login-button" onClick={() => setMostrarAdmin(false)}>
                Voltar ao Site
              </button>
            </nav>
          </div>
        </header>

        <div className="container" style={{ padding: "40px 20px" }}>
          <h2>Gerir Ofertas Publicadas ({ofertas.length})</h2>
          <p style={{ color: "#6c757d", marginBottom: "20px" }}>Visualize todas as ofertas e remova se necessário.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {ofertas.length > 0 ? (
              ofertas.map((prod) => {
                const expirada = prod.dataExpiracao && new Date(prod.dataExpiracao) < agora;
                const dataFormatada = prod.dataExpiracao ? new Date(prod.dataExpiracao).toLocaleDateString('pt-BR') : 'Indeterminada';
                
                return (
                  <div key={prod.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)", borderLeft: expirada ? "5px solid #dc3545" : "5px solid #28a745" }}>
                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                      <img 
                        src={prod.image || IMAGEM_PADRAO} 
                        alt={prod.name} 
                        onError={(e) => { e.target.src = IMAGEM_PADRAO; }}
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }} 
                      />
                      <div>
                        <h4 style={{ margin: "0 0 5px 0" }}>{prod.name} {expirada && <span style={{ color: "#dc3545", fontSize: "0.75rem" }}>(Expirada)</span>}</h4>
                        <p style={{ margin: 0, color: "#e63946", fontWeight: "bold" }}>{prod.price} <span style={{ textDecoration: "line-through", color: "#868e96", fontSize: "0.85rem", fontWeight: "normal" }}>{prod.oldPrice}</span></p>
                        <small style={{ color: "#6c757d" }}>{prod.cidade} • {prod.categoria} • 👀 {prod.visualizacoes || 0} visualizações • Validade: {dataFormatada}</small>
                      </div>
                    </div>
                    <button 
                      onClick={() => apagarOferta(prod.id)}
                      style={{ background: "#dc3545", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                    >
                      Excluir
                    </button>
                  </div>
                );
              })
            ) : (
              <p>Nenhuma oferta registada.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <div className="container header-content">
          <div className="logo" onClick={() => { setMostrarFavoritos(false); setCategoriaSelecionada("Todas"); setCidadeSelecionada("Todas"); setTermoBusca(""); }} style={{ cursor: "pointer" }}>
            🔥 Ofertas Aqui
          </div>
          <nav style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); setMostrarFavoritos(false); setCategoriaSelecionada("Todas"); setCidadeSelecionada("Todas"); setTermoBusca(""); }}>Início</a>
            
            <button 
              onClick={() => setMostrarFavoritos(!mostrarFavoritos)} 
              style={{ background: mostrarFavoritos ? "#e63946" : "transparent", border: "1px solid #ced4da", color: mostrarFavoritos ? "#fff" : "#495057", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "500" }}
            >
              ❤️ Favoritos ({favoritosIds.length})
            </button>

            <button className="login-button" onClick={() => setMostrarAdmin(true)} style={{ background: "transparent", border: "1px solid #ced4da", color: "#495057" }}>
              Painel Admin
            </button>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container">
          <span className="tag">🔥 OFERTAS DO DIA</span>
          <h1>Encontre produtos<br />com preços incríveis</h1>
          <p>Encontre ofertas publicadas por lojas e vendedores da sua região.</p>
          
          <div className="search-box" style={{ display: "flex", gap: "10px", flexWrap: "wrap", background: "#fff", padding: "8px", borderRadius: "8px", maxWidth: "700px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="O que você está procurando?"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              style={{ flex: 2, border: "none", padding: "10px", outline: "none", fontSize: "1rem" }}
            />
            
            <select
              value={cidadeSelecionada}
              onChange={(e) => setCidadeSelecionada(e.target.value)}
              style={{ flex: 1, border: "1px solid #ced4da", borderRadius: "6px", padding: "10px", background: "#fff", color: "#495057", outline: "none" }}
            >
              {cidadesDisponiveis.map(cidade => (
                <option key={cidade} value={cidade}>📍 {cidade === "Todas" ? "Todas as Cidades" : cidade}</option>
              ))}
            </select>

            <button onClick={() => {
              const elemento = document.getElementById("ofertas-destaque");
              if (elemento) elemento.scrollIntoView({ behavior: "smooth" });
            }} style={{ background: "#e63946", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
              Buscar
            </button>
          </div>
        </div>
      </section>

      {!mostrarFavoritos && (
        <section className="categorias-section" style={{ padding: "20px 0", background: "#f8f9fa", textAlign: "center" }}>
          <div className="container" style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            {["Todas", ...CATEGORIAS_VALIDAS].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaSelecionada(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: "1px solid #ced4da",
                  background: categoriaSelecionada === cat ? "#e63946" : "#fff",
                  color: categoriaSelecionada === cat ? "#fff" : "#495057",
                  cursor: "pointer",
                  fontWeight: "500"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="offers" id="ofertas-destaque">
        <div className="container">
          <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <h2>
                {mostrarFavoritos ? "❤️ Meus Produtos Favoritos" : `🔥 Ofertas em destaque ${categoriaSelecionada !== "Todas" ? `- ${categoriaSelecionada}` : ""} ${cidadeSelecionada !== "Todas" ? ` em ${cidadeSelecionada}` : ""}`}
              </h2>
              <p>
                {mostrarFavoritos ? "Produtos que você salvou para ver depois." : (termoBusca ? `Resultados para "${termoBusca}"` : "Confira os produtos publicados recentemente (válidos por 30 dias).")}
              </p>
            </div>

            <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
              {/* SELETOR DE ORDENAÇÃO */}
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ fontSize: "0.9rem", color: "#495057", fontWeight: "500" }}>Ordenar:</span>
                <select
                  value={ordemSelecionada}
                  onChange={(e) => setOrdemSelecionada(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #ced4da", background: "#fff", color: "#495057", outline: "none", fontSize: "0.9rem" }}
                >
                  <option value="recentes">Mais Recentes</option>
                  <option value="menor-preco">Menor Preço</option>
                  <option value="maior-preco">Maior Preço</option>
                </select>
              </div>

              <button
                className="publish-button"
                onClick={() => setMostrarPublicar(true)}
              >
                + Publicar oferta
              </button>
            </div>
          </div>

          <div className="products">
            {ofertasOrdenadas.length > 0 ? (
              ofertasOrdenadas.map((prod) => (
                <Product
                  key={prod.id}
                  produto={prod}
                  eFavorito={favoritosIds.includes(prod.id)}
                  aoFavoritar={() => toggleFavorito(prod)}
                  aoVerDetalhes={() => verDetalhesProduto(prod)}
                  imagemPadrao={IMAGEM_PADRAO}
                />
              ))
            ) : (
              <p style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px", color: "#6c757d" }}>
                {mostrarFavoritos ? "Ainda não tem nenhum produto favoritado." : "Nenhuma oferta ativa encontrada para os filtros selecionados."}
              </p>
            )}
          </div>
        </div>
      </section>

      {produtoSelecionado && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000, padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#fff", borderRadius: "12px", maxWidth: "600px", width: "100%",
            maxHeight: "90vh", overflowY: "auto", padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)", position: "relative"
          }}>
            <button 
              onClick={() => setProdutoSelecionado(null)}
              style={{
                position: "absolute", top: "15px", right: "15px", background: "#f1f3f5",
                border: "none", borderRadius: "50%", width: "35px", height: "35px", cursor: "pointer", fontWeight: "bold"
              }}
            >
              ✕
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ background: "#e9ecef", padding: "4px 8px", borderRadius: "4px", fontSize: "0.8rem", fontWeight: "bold", color: "#495057" }}>
                {produtoSelecionado.categoria}
              </span>
              <button
                onClick={() => partilharProduto(produtoSelecionado)}
                style={{ background: "transparent", border: "1px solid #ced4da", borderRadius: "6px", padding: "5px 10px", cursor: "pointer", fontSize: "0.85rem", color: "#495057", fontWeight: "500" }}
              >
                🔗 Partilhar Oferta
              </button>
            </div>

            <h2 style={{ margin: "10px 0 15px 0", color: "#212529" }}>{produtoSelecionado.name}</h2>
            
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img 
                src={produtoSelecionado.image || IMAGEM_PADRAO} 
                alt={produtoSelecionado.name} 
                onError={(e) => { e.target.src = IMAGEM_PADRAO; }}
                style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "8px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px", alignItems: "baseline", marginBottom: "15px" }}>
              {produtoSelecionado.oldPrice && (
                <span style={{ textDecoration: "line-through", color: "#868e96", fontSize: "1rem" }}>
                  {produtoSelecionado.oldPrice}
                </span>
              )}
              <strong style={{ fontSize: "1.8rem", color: "#e63946" }}>
                {produtoSelecionado.price}
              </strong>
            </div>

            <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
              <p style={{ margin: "5px 0" }}><strong>📍 Cidade:</strong> {produtoSelecionado.cidade}</p>
              <p style={{ margin: "5px 0" }}><strong>🏠 Endereço:</strong> {produtoSelecionado.endereco}</p>
              <p style={{ margin: "5px 0" }}><strong>📞 Contato / WhatsApp:</strong> {produtoSelecionado.telefone}</p>
              <p style={{ margin: "5px 0" }}><strong>👀 Visualizações:</strong> {produtoSelecionado.visualizacoes || 1}</p>
              {produtoSelecionado.dataExpiracao && (
                <p style={{ margin: "5px 0" }}><strong>⏳ Válido até:</strong> {new Date(produtoSelecionado.dataExpiracao).toLocaleDateString('pt-BR')}</p>
              )}
              {produtoSelecionado.localizacao && (
                <p style={{ margin: "5px 0" }}>
                  <strong>🗺️ Localização:</strong> <a href={produtoSelecionado.localizacao} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>Abrir no Google Maps</a>
                </p>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4>Descrição do Produto</h4>
              <p style={{ color: "#495057", lineHeight: "1.5", marginTop: "5px" }}>{produtoSelecionado.descricao}</p>
            </div>

            {produtoSelecionado.telefone && produtoSelecionado.telefone !== "Não informado" && (
              <a
                href={`https://wa.me/55${produtoSelecionado.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Vi o anúncio "${produtoSelecionado.name}" (${produtoSelecionado.price}) no Ofertas Aqui e tenho interesse.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", textAlign: "center", backgroundColor: "#25d366", color: "#fff",
                  padding: "12px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold", fontSize: "1rem", marginBottom: "10px"
                }}
              >
                💬 Falar com o Vendedor no WhatsApp
              </a>
            )}

            <button 
              onClick={() => setProdutoSelecionado(null)}
              style={{ width: "100%", padding: "12px", backgroundColor: "#f1f3f5", color: "#495057", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <footer>
        <div className="container">
          <p>© 2026 Ofertas Aqui — Encontre e publique ofertas.</p>
        </div>
      </footer>
    </div>
  );
}

function Product({ produto, eFavorito, aoFavoritar, aoVerDetalhes, imagemPadrao }) {
  return (
    <div className="product-card" style={{ position: "relative" }}>
      <button
        onClick={aoFavoritar}
        title={eFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        style={{
          position: "absolute", top: "10px", right: "10px", background: "rgba(255, 255, 255, 0.9)",
          border: "none", borderRadius: "50%", width: "35px", height: "35px", display: "flex",
          alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "1.2rem",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)", zIndex: 2
        }}
      >
        {eFavorito ? "❤️" : "🤍"}
      </button>

      <img 
        src={produto.image || imagemPadrao} 
        alt={produto.name} 
        onError={(e) => { e.target.src = imagemPadrao; }}
      />
      <div className="product-info">
        <span className="discount">OFERTA</span>
        <h3>{produto.name}</h3>
        {produto.oldPrice && <span className="old-price">{produto.oldPrice}</span>}
        <strong className="price">{produto.price}</strong>
        <p style={{ fontSize: "0.85rem", color: "#6c757d", margin: "5px 0" }}>📍 {produto.cidade} • 👀 {produto.visualizacoes || 0}</p>

        <button className="details-button" onClick={aoVerDetalhes}>
          Ver oferta
        </button>
      </div>
    </div>
  );
}

export default App;