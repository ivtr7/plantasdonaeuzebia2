/* =========================================================
   Dona Euzébia Plantas — Script principal (site.js)
   Organização:
   1) Dados (categorias, produtos, utilitários WhatsApp)
   2) Estado do carrinho (localStorage)
   3) Sistema de rotas (hash routing)
   4) Renderização de páginas (Home, Catálogo, Sobre, Contato, Obrigado)
   5) Cabeçalho (busca, menu mobile)
   6) Drawer do carrinho
   7) Toast
   8) Inicialização
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     1) Dados
     ========================================================= */
  const URL_BANNER = "/__l5e/assets-v1/d0805b1f-1ac4-4a2d-af7a-a7325e09a6df/banner01.png";
  const WHATSAPP_NUMERO = "5532999183344";

  const CATEGORIAS = [
    "Árvores Nativas",
    "Citros",
    "Frutíferas",
    "Forrações",
    "Palmeiras",
    "Ornamentais",
  ];

  const SLUGS_CATEGORIAS = {
    "Árvores Nativas": "arvores-nativas",
    "Citros": "citros",
    "Frutíferas": "frutiferas",
    "Forrações": "forracoes",
    "Palmeiras": "palmeiras",
    "Ornamentais": "ornamentais",
  };

  // Helper: gera slug a partir de uma string
  function gerarSlug(texto) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  // Helper: monta produtos a partir de lista de nomes
  function montarProdutos(categoria, nomes) {
    const vistos = new Set();
    return nomes
      .filter((n) => {
        const chave = n.toLowerCase().trim();
        if (vistos.has(chave)) return false;
        vistos.add(chave);
        return true;
      })
      .map((n) => ({
        id: `${SLUGS_CATEGORIAS[categoria]}-${gerarSlug(n)}`,
        name: n,
        category: categoria,
        spec: "Todos os portes",
      }));
  }

  const PRODUTOS = [
    ...montarProdutos("Árvores Nativas", [
      "Acassia Amarela","Acassia Rosa","Acassia Roxa","Angico Branco","Angico Folha",
      "Aroeira Salsa","Aroeira Vermelha","Babatimão","Canafístula","Espatodia",
      "Espirradeira","Flamboyant","Inga","Ipê Amarelo","Ipê Branco","Ipê Rosa",
      "Jasmim Manga","Magnolia","Manaca da Serra","Murta Toceira","Oiti",
      "Paineira Rosa","Pata de Vaca","Pau Brasil","Pau Ferro","Quaresmeira Rosa",
      "Quaresmeira Roxa","Reseda","Sibipiruna","Teka",
    ]),
    ...montarProdutos("Citros", [
      "Laranja Campista","Laranja Lima","Lima","Limão Taithi","Mexerica Rio",
      "Pokã","Tangerina",
    ]),
    ...montarProdutos("Frutíferas", [
      "Abacate","Abiu Amarelo","Abiu Roxo","Acerola","Ameixa","Ameixa do Japão",
      "Amora Vermelha","Araçá","Atemoia","Cacau","Caju","Cambucá","Caqui",
      "Carambola","Castanha Portuguesa","Cereja do Rio Grande","Cupuaçu","Figo",
      "Flor do Jambo","Framboesa","Fruta Pão","Fruto do Conde ou Pinha","Goiaba",
      "Graviola","Groselha","Groselha Branca","Grumixama","Guaraná","Jabuticaba",
      "Jaca","Jambo","Jamelão","Jenipapo","Kinkã","Kiwi","Lixia","Maçã","Mamão",
      "Manga Palmer","Manga Tommy","Manga Ubá","Mangostão","Maracujá","Marmelo",
      "Mirtilo","Nectarina","Noni","Noz Pecan","Pera","Pêssego","Pitanga Vermelha",
      "Pitomba","Romã","Sapoti","Siriguela","Tamarindo","Uva","Uva Verde","Uvaia",
    ]),
    ...montarProdutos("Forrações", [
      "Begonia","Bela Emilia Azul","Bela Emilia Branca","Camarão Amarelo","Cinéria",
      "Clorofito","Cravina","Cravo Difunto","Erica Amarela","Erica Rosa","Erica Roxa",
      "Flor do Guaruja","Grama Amendoim","Iresine","Jeranio","Kalanchoe",
      "Lanatana Cambara","Lavanda","Mini Grama Preta","Onze Horas","Penta Vermelha",
      "Salvia Vermelha","Unha de Gato","Vinca",
    ]),
    ...montarProdutos("Palmeiras", [
      "Açaí","Areca Bambu","Areca Catechu","Areca de Locuba","Areca Vestiaria",
      "Bismarck","Buriti","Butiá","Carpentaria","Coco Anão","Fênix","Garrafão",
      "Laca","Palmeira Azul e palmeira-de-bismarck","Palmeira Imperial",
      "Palmeirinha de Petropolis","Pata de Elefante","Pinanga","Rabo de Raposa",
      "Real","Tamareira Dactylifera","Tamareira das Canárias","Triangular",
      "Veitchia Joannis","Veitchia Merrillii","Washingtonia",
    ]),
    ...montarProdutos("Ornamentais", [
      "Agave","Alpinia Purpurata","Alpinia Zerumbet","Aspargo","Azaléia","Bambuza",
      "Bougainvillea","Bromélias Variadas","Buxinho","Camélia","Chuva de Prata",
      "Cipreste Italiano","Cycas Circinais","Dianela","Dracena Cordiline",
      "Dracena Poá","Dracena Tricolor","Fórmio","Flor do deserto","Ixora Mid",
      "Jade Vermelha","Kaizuca","Lírio Amarelo","Licuala","Liriopes","Moreia Branca",
      "Mussaenda","Orquídea Bambu","Pinheiro","Pleomele Amarela","Pleomele Inversa",
      "Pleomele Variegata","Podocarpus","Rafia","Strelitzia","Tuia","Tuia Compacta",
      "Yuca Elephantine","Yuca Rigida","Yuca Tronco","Yuca Variegata","Zamea",
    ]),
  ];

  // Monta o link do WhatsApp com a lista de itens do orçamento
  function montarUrlWhatsapp(itens) {
    if (!itens || itens.length === 0) {
      const vazio = "Olá! Gostaria de solicitar um orçamento de plantas. Pode me ajudar?";
      return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(vazio)}`;
    }
    const agrupados = new Map();
    for (const it of itens) {
      const arr = agrupados.get(it.category) || [];
      arr.push(it);
      agrupados.set(it.category, arr);
    }
    let corpo = "Olá! Gostaria de solicitar um orçamento com os seguintes produtos:\n";
    for (const [cat, lista] of agrupados) {
      corpo += `\n[${cat}]\n`;
      for (const it of lista) {
        corpo += `- ${it.name} | Quantidade: ${it.quantity} | Especificação: ${it.spec}\n`;
      }
    }
    corpo += "\nAguardo retorno. Obrigado!";
    return `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(corpo)}`;
  }

  /* =========================================================
     2) Carrinho (estado + persistência)
     ========================================================= */
  const CHAVE_CARRINHO = "dona-euzebia-cart-v1";

  const carrinho = {
    itens: [],
    carregar() {
      try {
        const dados = localStorage.getItem(CHAVE_CARRINHO);
        this.itens = dados ? JSON.parse(dados) : [];
      } catch {
        this.itens = [];
      }
    },
    salvar() {
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(this.itens));
      this.notificar();
    },
    notificar() {
      atualizarBadgeCarrinho();
      renderizarCarrinho();
    },
    adicionar(produto) {
      const existente = this.itens.find((i) => i.id === produto.id);
      if (existente) {
        existente.quantity += 1;
      } else {
        this.itens.push({ ...produto, quantity: 1 });
      }
      this.salvar();
    },
    definirQuantidade(id, qtd) {
      if (qtd <= 0) {
        this.remover(id);
        return;
      }
      const item = this.itens.find((i) => i.id === id);
      if (item) item.quantity = qtd;
      this.salvar();
    },
    remover(id) {
      this.itens = this.itens.filter((i) => i.id !== id);
      this.salvar();
    },
    limpar() {
      this.itens = [];
      this.salvar();
    },
    totalItens() {
      return this.itens.reduce((acc, i) => acc + i.quantity, 0);
    },
  };

  /* =========================================================
     3) Sistema de rotas (hash routing)
     ========================================================= */
  function rotaAtual() {
    const hash = window.location.hash.replace(/^#/, "") || "/";
    const [caminho, busca = ""] = hash.split("?");
    const params = new URLSearchParams(busca);
    return { caminho, params };
  }

  function navegar(caminho, params) {
    let hash = `#${caminho}`;
    if (params) {
      const sp = new URLSearchParams(params);
      const s = sp.toString();
      if (s) hash += `?${s}`;
    }
    window.location.hash = hash;
  }

  function renderizar() {
    const { caminho } = rotaAtual();
    const main = document.getElementById("app-main");
    main.innerHTML = "";

    switch (caminho) {
      case "/":
        main.appendChild(viewHome());
        break;
      case "/catalogo":
        main.appendChild(viewCatalogo());
        break;
      case "/sobre":
        main.appendChild(viewSobre());
        break;
      case "/contato":
        main.appendChild(viewContato());
        break;
      case "/obrigado":
        main.appendChild(viewObrigado());
        break;
      default:
        main.appendChild(viewHome());
    }

    marcarLinkAtivo(caminho);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function marcarLinkAtivo(caminho) {
    document.querySelectorAll("[data-route]").forEach((el) => {
      if (el.getAttribute("data-route") === caminho) {
        el.classList.add("is-active");
      } else {
        el.classList.remove("is-active");
      }
    });
  }

  /* =========================================================
     4) Views (páginas)
     ========================================================= */

  // Helper para criar elementos a partir de HTML
  function html(strings, ...valores) {
    const tpl = document.createElement("template");
    let saida = "";
    strings.forEach((s, i) => {
      saida += s + (valores[i] !== undefined ? valores[i] : "");
    });
    tpl.innerHTML = saida.trim();
    return tpl.content.firstElementChild;
  }

  // Gera um placeholder SVG (folha) para o card de produto
  function thumbPlanta(nome) {
    let hash = 0;
    for (let i = 0; i < nome.length; i++) hash = (hash * 31 + nome.charCodeAt(i)) | 0;
    const hue = 130 + (Math.abs(hash) % 50);
    const bg1 = `oklch(0.96 0.06 ${hue})`;
    const bg2 = `oklch(0.88 0.10 ${hue + 10})`;
    const estilo = `background: radial-gradient(120% 90% at 20% 10%, ${bg1} 0%, transparent 55%), radial-gradient(110% 100% at 80% 100%, ${bg2} 0%, transparent 60%), linear-gradient(135deg, ${bg1}, ${bg2});`;
    return `
      <div class="plant-thumb" style="${estilo}">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17 3c-7 0-13 5.5-13 13 0 .8.1 1.6.3 2.3C7 14 11 11.5 16 11c-4.5 1.8-7.8 5-9.4 9.4.7.2 1.5.3 2.4.3 7 0 13-5.5 13-13V3h-5z" />
        </svg>
      </div>
    `;
  }

  // Card de produto
  function cardProduto(produto) {
    const el = html`
      <article class="product-card lift">
        ${thumbPlanta(produto.name)}
        <p class="product-cat">${produto.category}</p>
        <h3 class="product-name">${produto.name}</h3>
        <p class="product-spec">${produto.spec}</p>
        <div class="product-actions">
          <button class="btn-add" data-add-product>
            <i data-lucide="plus"></i> Adicionar ao orçamento
          </button>
        </div>
      </article>
    `;
    el.querySelector("[data-add-product]").addEventListener("click", () => {
      carrinho.adicionar(produto);
      mostrarToast("Adicionado ao orçamento", produto.name);
    });
    return el;
  }

  // -------- Página HOME --------
  function viewHome() {
    const beneficios = [
      { icon: "sparkles", title: "Amplo catálogo", text: "Mais de 180 variedades de plantas" },
      { icon: "message-circle", title: "Orçamento pelo WhatsApp", text: "Atendimento rápido e personalizado" },
      { icon: "leaf", title: "Plantas saudáveis", text: "Produtos bem cuidados e de qualidade" },
      { icon: "shield-check", title: "Paisagismo e orientação", text: "Soluções para jardins e projetos" },
    ];

    // Seleciona 8 produtos aleatórios em destaque
    const destaques = [...PRODUTOS].sort(() => Math.random() - 0.5).slice(0, 8);

    const root = document.createElement("div");

    // Hero banner com a imagem enviada pelo cliente
    root.appendChild(html`
      <section class="hero-banner">
        <a href="#/catalogo" data-route="/catalogo" aria-label="Ver catálogo">
          <img src="${"./banner.png"}" alt="Dona Euzébia Plantas" />
        </a>
      </section>
    `);

    // Bloco de benefícios
    const sectionBeneficios = html`
      <section class="benefits-section container">
        <div class="benefits-grid"></div>
      </section>
    `;
    const gridBeneficios = sectionBeneficios.querySelector(".benefits-grid");
    beneficios.forEach((b) => {
      gridBeneficios.appendChild(html`
        <div class="benefit-card">
          <span class="benefit-icon"><i data-lucide="${b.icon}"></i></span>
          <div>
            <p class="benefit-title">${b.title}</p>
            <p>${b.text}</p>
          </div>
        </div>
      `);
    });
    root.appendChild(sectionBeneficios);

    // Produtos em destaque
    const sectionDestaques = html`
      <section class="section">
        <div class="section-header">
          <div>
            <p class="text-eyebrow">Vitrine</p>
            <h2 class="section-title">Produtos em destaque</h2>
          </div>
          <a class="section-link" href="#/catalogo" data-route="/catalogo">Ver catálogo →</a>
        </div>
        <div class="products-grid"></div>
      </section>
    `;
    const gridDestaques = sectionDestaques.querySelector(".products-grid");
    destaques.forEach((p) => gridDestaques.appendChild(cardProduto(p)));
    root.appendChild(sectionDestaques);

    // Bloco institucional
    root.appendChild(html`
      <section class="section">
        <div class="institutional">
          <div>
            <p class="text-eyebrow">Quem somos</p>
            <h2>Dona Euzébia Plantas</h2>
            <p>
              A Dona Euzébia Plantas atua há mais de duas décadas oferecendo plantas
              ornamentais, árvores nativas, frutíferas, citros, forrações, palmeiras e
              soluções para paisagismo. Nosso compromisso é entregar plantas saudáveis,
              atendimento personalizado e orientação para quem deseja transformar
              ambientes com mais verde, beleza e vida.
            </p>
            <div style="margin-top: 24px;">
              <a class="btn-pathfinder" href="#/sobre" data-route="/sobre">Conheça nossa história</a>
            </div>
          </div>
          <div class="icon-tile-grid">
            <div class="icon-tile"><i data-lucide="leaf"></i></div>
            <div class="icon-tile"><i data-lucide="sparkles"></i></div>
            <div class="icon-tile"><i data-lucide="shield-check"></i></div>
            <div class="icon-tile"><i data-lucide="truck"></i></div>
            <div class="icon-tile"><i data-lucide="message-circle"></i></div>
            <div class="icon-tile"><i data-lucide="leaf"></i></div>
          </div>
        </div>
      </section>
    `);

    // CTA final
    root.appendChild(html`
      <section class="section">
        <div class="final-cta">
          <i data-lucide="leaf" class="leaf-deco leaf-deco--tl" style="width:260px;height:260px;"></i>
          <i data-lucide="leaf" class="leaf-deco leaf-deco--br" style="width:220px;height:220px;"></i>
          <h2>Precisa de plantas para sua casa, sítio, jardim ou projeto?</h2>
          <p>Monte seu orçamento pelo catálogo ou fale diretamente com nossa equipe pelo WhatsApp.</p>
          <div class="cta-actions">
            <a class="btn-pathfinder btn-pathfinder--light" href="#/catalogo" data-route="/catalogo">Ver catálogo</a>
            <a class="btn-pathfinder" href="https://wa.me/${WHATSAPP_NUMERO}" target="_blank" rel="noopener noreferrer">
              <i data-lucide="message-circle"></i> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    `);

    return root;
  }

  // -------- Página CATÁLOGO --------
  function viewCatalogo() {
    const { params } = rotaAtual();
    let categoriaAtiva = null;
    const slugAtivo = params.get("cat");
    if (slugAtivo) {
      const encontrada = CATEGORIAS.find((c) => SLUGS_CATEGORIAS[c] === slugAtivo);
      if (encontrada) categoriaAtiva = encontrada;
    }
    let termoBusca = params.get("q") || "";

    const root = document.createElement("div");

    // Hero
    root.appendChild(html`
      <section class="page-hero">
        <div class="inner">
          <p class="text-eyebrow">Catálogo</p>
          <h1>Nossas plantas</h1>
          <p>
            Filtre por categoria ou busque pelo nome da planta. Monte seu carrinho de
            orçamento e envie pelo WhatsApp.
          </p>
          <div class="catalog-search-row">
            <div class="catalog-search">
              <i data-lucide="search" class="search-icon"></i>
              <input type="text" data-catalog-input value="${termoBusca}" placeholder="Buscar planta pelo nome..." />
              <button type="button" class="catalog-clear" data-catalog-clear hidden>
                <i data-lucide="x"></i> Limpar
              </button>
            </div>
          </div>
        </div>
      </section>
    `);

    // Seção de categorias (grade de cards)
    const secCategorias = html`
      <section class="section">
        <div class="section-header">
          <div>
            <p class="text-eyebrow">Navegue por</p>
            <h2 class="section-title">Categorias</h2>
          </div>
          <a class="section-link" href="#/catalogo" data-cat-all>Ver todas →</a>
        </div>
        <div class="categories-grid" data-categories-grid></div>
      </section>
    `;
    const gridCategorias = secCategorias.querySelector("[data-categories-grid]");

    const construirCardCategoria = (label, slug, ativa) => {
      const card = html`
        <button type="button" class="category-card ${ativa ? "is-active" : ""}">
          <span class="cat-icon"><i data-lucide="leaf"></i></span>
          <p>${label}</p>
        </button>
      `;
      card.addEventListener("click", () => {
        const p = new URLSearchParams();
        if (termoBusca) p.set("q", termoBusca);
        if (slug) p.set("cat", slug);
        navegar("/catalogo", p);
      });
      return card;
    };

    gridCategorias.appendChild(construirCardCategoria("Todas", null, !categoriaAtiva));
    CATEGORIAS.forEach((c) => {
      gridCategorias.appendChild(
        construirCardCategoria(c, SLUGS_CATEGORIAS[c], categoriaAtiva === c),
      );
    });
    root.appendChild(secCategorias);

    // Seção de produtos
    const secProdutos = html`<section class="catalog-section" data-products-section></section>`;
    root.appendChild(secProdutos);

    function renderizarProdutos() {
      const termo = termoBusca.trim().toLowerCase();
      const filtrados = PRODUTOS.filter((p) => {
        if (categoriaAtiva && p.category !== categoriaAtiva) return false;
        if (termo && !p.name.toLowerCase().includes(termo)) return false;
        return true;
      });

      secProdutos.innerHTML = "";

      if (filtrados.length === 0) {
        const vazio = html`
          <div class="empty-state">
            <p>Nenhuma planta encontrada</p>
            <p>Tente buscar com outro termo ou limpe os filtros.</p>
            <button class="btn-pathfinder" data-empty-clear>Limpar filtros</button>
          </div>
        `;
        vazio.querySelector("[data-empty-clear]").addEventListener("click", () => {
          termoBusca = "";
          categoriaAtiva = null;
          navegar("/catalogo");
        });
        secProdutos.appendChild(vazio);
      } else if (categoriaAtiva) {
        const grupo = html`
          <div class="category-group">
            <div class="group-header">
              <h2>${categoriaAtiva}</h2>
              <span style="font-size:13px;color:var(--ink-soft);">
                ${filtrados.length} ${filtrados.length === 1 ? "planta" : "plantas"}
              </span>
            </div>
            <div class="products-grid" data-grid></div>
          </div>
        `;
        const grid = grupo.querySelector("[data-grid]");
        filtrados.forEach((p) => grid.appendChild(cardProduto(p)));
        secProdutos.appendChild(grupo);
      } else {
        // Mostra agrupado por categoria (até 8 por categoria)
        CATEGORIAS.forEach((c) => {
          const lista = filtrados.filter((p) => p.category === c);
          if (lista.length === 0) return;
          const grupo = html`
            <div class="category-group">
              <div class="group-header">
                <div>
                  <p class="text-eyebrow">Categoria</p>
                  <h2>${c}</h2>
                </div>
                <a class="section-link" data-ver-mais>Ver todos (${lista.length}) →</a>
              </div>
              <div class="products-grid" data-grid></div>
            </div>
          `;
          grupo.querySelector("[data-ver-mais]").addEventListener("click", (ev) => {
            ev.preventDefault();
            const p = new URLSearchParams();
            p.set("cat", SLUGS_CATEGORIAS[c]);
            navegar("/catalogo", p);
          });
          const grid = grupo.querySelector("[data-grid]");
          lista.slice(0, 8).forEach((p) => grid.appendChild(cardProduto(p)));
          secProdutos.appendChild(grupo);
        });
      }

      if (window.lucide) window.lucide.createIcons();
    }

    // Configurar input de busca
    setTimeout(() => {
      const input = root.querySelector("[data-catalog-input]");
      const btnClear = root.querySelector("[data-catalog-clear]");
      const btnAll = root.querySelector("[data-cat-all]");

      const atualizarClear = () => {
        btnClear.hidden = !termoBusca && !categoriaAtiva;
      };
      atualizarClear();

      input.addEventListener("input", (e) => {
        termoBusca = e.target.value;
        renderizarProdutos();
        atualizarClear();
      });
      btnClear.addEventListener("click", () => {
        termoBusca = "";
        categoriaAtiva = null;
        navegar("/catalogo");
      });
      btnAll.addEventListener("click", (e) => {
        e.preventDefault();
        const p = new URLSearchParams();
        if (termoBusca) p.set("q", termoBusca);
        navegar("/catalogo", p);
      });
    }, 0);

    renderizarProdutos();
    return root;
  }

  // -------- Página SOBRE --------
  function viewSobre() {
    const valores = [
      { icon: "sparkles", title: "Qualidade", text: "Oferecer sempre plantas saudáveis, bem cuidadas e selecionadas." },
      { icon: "heart-handshake", title: "Atendimento personalizado", text: "Orientar cada cliente com conhecimento técnico, atenção e empatia." },
      { icon: "recycle", title: "Sustentabilidade", text: "Promover práticas de cultivo, manejo e paisagismo que valorizem o meio ambiente." },
      { icon: "shield-check", title: "Transparência", text: "Manter clareza, respeito e confiança em todas as relações comerciais." },
    ];
    const diferenciais = [
      { icon: "leaf", title: "Amplo catálogo", text: "Mais de 180 variedades de plantas organizadas por categorias." },
      { icon: "heart-handshake", title: "Atendimento especializado", text: "Equipe preparada para orientar sobre cultivo, escolha e cuidados." },
      { icon: "message-circle", title: "Orçamento via WhatsApp", text: "Processo simples e rápido para solicitar cotações." },
      { icon: "credit-card", title: "Cartão de fidelidade", text: "Programa de benefícios para clientes frequentes." },
      { icon: "globe", title: "Presença digital", text: "Site moderno com catálogo online e navegação intuitiva." },
    ];

    const root = document.createElement("div");

    root.appendChild(html`
      <section class="sobre-hero">
        <div class="inner">
          <p class="text-eyebrow">Sobre nós</p>
          <h1>Sobre a Dona Euzébia Plantas</h1>
          <p>Há mais de duas décadas cultivando qualidade, confiança e soluções para ambientes mais verdes.</p>
        </div>
      </section>
    `);

    root.appendChild(html`
      <section class="sobre-text">
        <p>
          A Dona Euzébia Plantas atua no mercado há mais de duas décadas, consolidando-se
          como uma das principais referências regionais no segmento de plantas e
          paisagismo. Ao longo dos anos, a empresa expandiu seu catálogo e aprimorou
          seus serviços para atender clientes residenciais, comerciais, produtores,
          arquitetos, paisagistas e projetos de diferentes portes.
        </p>
        <p>
          Nosso trabalho une variedade, cuidado e orientação especializada para ajudar
          cada cliente a encontrar a planta ideal para sua necessidade, seja para
          decorar, cultivar, reflorestar, produzir frutos ou transformar um ambiente
          por meio do paisagismo.
        </p>
      </section>
    `);

    root.appendChild(html`
      <section class="sobre-cards">
        <div class="mission-vision">
          <div class="mission-card">
            <p class="text-eyebrow">Missão</p>
            <p>
              Fornecer plantas de alta qualidade, atendimento personalizado e soluções
              completas para paisagismo e cultivo, contribuindo para ambientes mais
              verdes, bonitos e saudáveis.
            </p>
          </div>
          <div class="vision-card">
            <p class="text-eyebrow">Visão</p>
            <p>
              Ser referência regional no varejo e atacado de plantas e paisagismo,
              reconhecida pela qualidade dos produtos, pela variedade do catálogo e
              pela excelência no atendimento.
            </p>
          </div>
        </div>
      </section>
    `);

    const secValores = html`
      <section class="valores-section">
        <div class="center-header">
          <p class="text-eyebrow">Nossos valores</p>
          <h2>O que nos move</h2>
        </div>
        <div class="valores-grid" data-grid></div>
      </section>
    `;
    const gridValores = secValores.querySelector("[data-grid]");
    valores.forEach((v) => {
      gridValores.appendChild(html`
        <div class="valor-card lift">
          <span class="icon-square"><i data-lucide="${v.icon}"></i></span>
          <h3>${v.title}</h3>
          <p>${v.text}</p>
        </div>
      `);
    });
    root.appendChild(secValores);

    root.appendChild(html`
      <div class="segmento-wrap">
        <div class="segmento-block">
          <p class="text-eyebrow">Segmento de atuação</p>
          <h2>Varejo, atacado e paisagismo</h2>
          <p>
            A Dona Euzébia Plantas atua no varejo e atacado de plantas ornamentais,
            árvores nativas, frutíferas, citros, forrações e palmeiras, além de
            oferecer soluções para paisagismo e consultoria técnica.
          </p>
        </div>
      </div>
    `);

    const secDif = html`
      <section class="diferenciais-section">
        <div class="center-header">
          <p class="text-eyebrow">Diferenciais</p>
          <h2>Por que escolher a Dona Euzébia</h2>
        </div>
        <div class="diferenciais-grid" data-grid></div>
      </section>
    `;
    const gridDif = secDif.querySelector("[data-grid]");
    diferenciais.forEach((d) => {
      gridDif.appendChild(html`
        <div class="diferencial-card lift">
          <span class="icon-square"><i data-lucide="${d.icon}"></i></span>
          <h3>${d.title}</h3>
          <p>${d.text}</p>
        </div>
      `);
    });
    root.appendChild(secDif);

    root.appendChild(html`
      <section class="section">
        <div class="final-cta" style="background: linear-gradient(135deg, #37B34A 0%, #38B28A 100%);">
          <h2>Vamos transformar seu espaço com mais verde?</h2>
          <div class="cta-actions">
            <a class="btn-pathfinder btn-pathfinder--light" href="#/catalogo" data-route="/catalogo">Ver catálogo</a>
            <a class="btn-pathfinder" href="https://wa.me/${WHATSAPP_NUMERO}" target="_blank" rel="noopener noreferrer">
              <i data-lucide="message-circle"></i> Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    `);

    return root;
  }

  // -------- Página CONTATO --------
  function viewContato() {
    const root = document.createElement("div");

    root.appendChild(html`
      <section class="page-hero">
        <div class="inner">
          <p class="text-eyebrow">Contato</p>
          <h1>Solicite seu orçamento</h1>
          <p>
            Preencha seus dados e conte para nossa equipe o que você precisa. Vamos
            analisar sua solicitação e retornar com orientação personalizada para
            ajudar você a escolher as plantas ideais.
          </p>
        </div>
      </section>
    `);

    const blocoForm = html`
      <section class="contato-grid">
        <div class="contato-form-card">
          <form class="contato-form" novalidate data-contato-form>
            <div class="field">
              <label for="nome">Nome completo</label>
              <input id="nome" name="nome" type="text" autocomplete="name" placeholder="Seu nome" />
              <span class="field-error" data-error-for="nome" hidden></span>
            </div>
            <div class="form-row">
              <div class="field">
                <label for="email">E-mail</label>
                <input id="email" name="email" type="email" autocomplete="email" placeholder="voce@exemplo.com" />
                <span class="field-error" data-error-for="email" hidden></span>
              </div>
              <div class="field">
                <label for="whatsapp">WhatsApp</label>
                <input id="whatsapp" name="whatsapp" type="tel" autocomplete="tel" placeholder="(00) 00000-0000" />
                <span class="field-error" data-error-for="whatsapp" hidden></span>
              </div>
            </div>
            <div class="field">
              <label for="mensagem">Mensagem / O que você precisa?</label>
              <textarea id="mensagem" name="mensagem" rows="5" placeholder="Conte-nos sobre seu projeto, espécies de interesse, quantidades..."></textarea>
              <span class="field-error" data-error-for="mensagem" hidden></span>
            </div>
            <div class="submit-error" data-submit-error hidden></div>
            <div class="form-actions">
              <button type="submit" class="btn-pathfinder" data-submit-btn>Solicitar orçamento</button>
              <a href="https://wa.me/${WHATSAPP_NUMERO}" target="_blank" rel="noopener noreferrer" class="wa-text-link">
                <i data-lucide="message-circle"></i> Falar diretamente pelo WhatsApp
              </a>
            </div>
          </form>
        </div>
        <aside class="contato-aside">
          <div class="contato-card-purple">
            <p class="text-eyebrow">Atendimento</p>
            <h3>Estamos prontos para ajudar</h3>
            <p>Nossa equipe responde com agilidade e orientação técnica para você escolher as plantas ideais.</p>
            <ul>
              <li><span class="li-icon"><i data-lucide="phone"></i></span>(32) 99918-3344</li>
              <li><span class="li-icon"><i data-lucide="mail"></i></span>contato@donaeuzebiaplantas.com.br</li>
              <li><span class="li-icon"><i data-lucide="map-pin"></i></span>Atendimento em todo o Brasil</li>
            </ul>
          </div>
          <div class="contato-card-white">
            <h4>Horário de atendimento</h4>
            <p>Segunda a sábado, das 8h às 18h. Aos domingos, mediante agendamento.</p>
          </div>
        </aside>
      </section>
    `;
    root.appendChild(blocoForm);

    // Validação e envio
    setTimeout(() => {
      const form = blocoForm.querySelector("[data-contato-form]");
      const errosSubmit = blocoForm.querySelector("[data-submit-error]");
      const btnSubmit = blocoForm.querySelector("[data-submit-btn]");

      function definirErro(campo, mensagem) {
        const el = blocoForm.querySelector(`[data-error-for="${campo}"]`);
        const input = blocoForm.querySelector(`[name="${campo}"]`);
        if (mensagem) {
          el.textContent = mensagem;
          el.hidden = false;
          input.classList.add("is-invalid");
        } else {
          el.hidden = true;
          input.classList.remove("is-invalid");
        }
      }

      form.querySelectorAll("input, textarea").forEach((el) => {
        el.addEventListener("input", () => definirErro(el.name, null));
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errosSubmit.hidden = true;

        const dados = {
          nome: form.nome.value.trim(),
          email: form.email.value.trim(),
          whatsapp: form.whatsapp.value.trim(),
          mensagem: form.mensagem.value.trim(),
        };

        let temErro = false;
        if (dados.nome.length < 2) { definirErro("nome", "Informe seu nome completo"); temErro = true; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) { definirErro("email", "E-mail inválido"); temErro = true; }
        if (dados.whatsapp.length < 8) { definirErro("whatsapp", "Informe um WhatsApp válido"); temErro = true; }
        if (dados.mensagem.length < 5) { definirErro("mensagem", "Conte um pouco mais"); temErro = true; }
        if (temErro) return;

        btnSubmit.disabled = true;
        btnSubmit.textContent = "Enviando...";
        try {
          await new Promise((r) => setTimeout(r, 600));
          navegar("/obrigado");
        } catch {
          errosSubmit.textContent =
            "Não foi possível enviar sua solicitação no momento. Tente novamente ou fale conosco pelo WhatsApp.";
          errosSubmit.hidden = false;
        } finally {
          btnSubmit.disabled = false;
          btnSubmit.textContent = "Solicitar orçamento";
        }
      });
    }, 0);

    return root;
  }

  // -------- Página OBRIGADO --------
  function viewObrigado() {
    const root = document.createElement("div");
    root.appendChild(html`
      <section class="obrigado-wrap">
        <div class="obrigado-card">
          <div class="obrigado-check">
            <i data-lucide="check-circle-2" style="width:44px;height:44px;"></i>
          </div>
          <h1>Solicitação enviada com sucesso!</h1>
          <p>
            Obrigado por entrar em contato com a Dona Euzébia Plantas. Recebemos sua
            mensagem e em breve nossa equipe retornará pelo WhatsApp ou e-mail
            informado.
          </p>
          <p>
            Enquanto isso, você pode continuar navegando pelo nosso catálogo ou
            falar diretamente com nossa equipe pelo WhatsApp.
          </p>
          <div class="obrigado-actions">
            <a class="btn-pathfinder" href="#/catalogo" data-route="/catalogo">Ver catálogo</a>
            <a class="btn-pathfinder btn-pathfinder--light" href="https://wa.me/${WHATSAPP_NUMERO}" target="_blank" rel="noopener noreferrer">
              <i data-lucide="message-circle"></i> Falar pelo WhatsApp
            </a>
          </div>
          <a class="obrigado-back" href="#/" data-route="/">
            <i data-lucide="arrow-left"></i> Voltar para a página inicial
          </a>
        </div>
      </section>
    `);
    return root;
  }

  /* =========================================================
     5) Cabeçalho (busca + menu mobile)
     ========================================================= */
  function inicializarCabecalho() {
    // Buscas (desktop e mobile)
    document.querySelectorAll("[data-search]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = form.querySelector("input");
        const q = (input.value || "").trim();
        const p = new URLSearchParams();
        if (q) p.set("q", q);
        navegar("/catalogo", p);
        input.value = "";
      });
    });

    // Categorias do rodapé
    const listaFooter = document.querySelector("[data-footer-categories]");
    CATEGORIAS.forEach((c) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#/catalogo?cat=${SLUGS_CATEGORIAS[c]}`;
      a.textContent = c;
      li.appendChild(a);
      listaFooter.appendChild(li);
    });

    // Ano corrente no rodapé
    document.querySelector("[data-current-year]").textContent = new Date().getFullYear();
  }

  /* =========================================================
     6) Drawer do carrinho
     ========================================================= */
  function inicializarCarrinho() {
    carrinho.carregar();
    const drawer = document.querySelector("[data-cart-drawer]");
    const backdrop = document.querySelector("[data-drawer-backdrop]");
    const btnAbrir = document.querySelector("[data-open-cart]");
    const btnFechar = document.querySelector("[data-close-cart]");

    function abrir() {
      drawer.hidden = false;
      backdrop.hidden = false;
      drawer.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function fechar() {
      drawer.hidden = true;
      backdrop.hidden = true;
      drawer.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
    btnAbrir.addEventListener("click", abrir);
    btnFechar.addEventListener("click", fechar);
    backdrop.addEventListener("click", fechar);

    document.querySelector("[data-clear-cart]").addEventListener("click", () => carrinho.limpar());

    atualizarBadgeCarrinho();
    renderizarCarrinho();
  }

  function atualizarBadgeCarrinho() {
    const badge = document.querySelector("[data-cart-count]");
    const total = carrinho.totalItens();
    if (total > 0) {
      badge.hidden = false;
      badge.textContent = total;
    } else {
      badge.hidden = true;
    }
  }

  function renderizarCarrinho() {
    const corpo = document.querySelector("[data-cart-body]");
    const pill = document.querySelector("[data-cart-pill]");
    const btnLimpar = document.querySelector("[data-clear-cart]");
    const linkWa = document.querySelector("[data-cart-wa]");
    if (!corpo) return;

    const total = carrinho.totalItens();
    if (total > 0) {
      pill.hidden = false;
      pill.textContent = `${total} ${total === 1 ? "item" : "itens"}`;
      btnLimpar.hidden = false;
      linkWa.classList.remove("is-disabled");
    } else {
      pill.hidden = true;
      btnLimpar.hidden = true;
      linkWa.classList.add("is-disabled");
    }
    linkWa.href = montarUrlWhatsapp(carrinho.itens);

    corpo.innerHTML = "";
    if (carrinho.itens.length === 0) {
      corpo.appendChild(html`
        <div class="cart-empty">
          <div>
            <div class="empty-icon"><i data-lucide="shopping-bag" style="width:28px;height:28px;"></i></div>
            <p>Seu carrinho de orçamento está vazio</p>
            <p>Adicione produtos do catálogo para solicitar um orçamento.</p>
          </div>
        </div>
      `);
    } else {
      const lista = html`<ul class="cart-list"></ul>`;
      carrinho.itens.forEach((it) => {
        const li = html`
          <li class="cart-item">
            <div class="ci-info">
              <p>${it.name}</p>
              <p>${it.category} · ${it.spec}</p>
              <div class="qty-control">
                <button type="button" data-minus aria-label="Diminuir"><i data-lucide="minus" style="width:14px;height:14px;"></i></button>
                <span>${it.quantity}</span>
                <button type="button" data-plus aria-label="Aumentar"><i data-lucide="plus" style="width:14px;height:14px;"></i></button>
              </div>
            </div>
            <button type="button" class="btn-remove" aria-label="Remover" data-remove>
              <i data-lucide="trash-2" style="width:16px;height:16px;"></i>
            </button>
          </li>
        `;
        li.querySelector("[data-minus]").addEventListener("click", () => carrinho.definirQuantidade(it.id, it.quantity - 1));
        li.querySelector("[data-plus]").addEventListener("click", () => carrinho.definirQuantidade(it.id, it.quantity + 1));
        li.querySelector("[data-remove]").addEventListener("click", () => carrinho.remover(it.id));
        lista.appendChild(li);
      });
      corpo.appendChild(lista);
    }

    if (window.lucide) window.lucide.createIcons();
  }

  /* =========================================================
     7) Toast
     ========================================================= */
  function mostrarToast(titulo, descricao) {
    const stack = document.querySelector("[data-toast-stack]");
    const el = html`
      <div class="toast">
        <strong>${titulo}</strong>
        <span>${descricao || ""}</span>
      </div>
    `;
    stack.appendChild(el);
    setTimeout(() => {
      el.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      setTimeout(() => el.remove(), 300);
    }, 2500);
  }

  /* =========================================================
     8) Inicialização
     ========================================================= */
  function inicializar() {
    inicializarCabecalho();
    inicializarCarrinho();
    window.addEventListener("hashchange", renderizar);
    renderizar();
    if (window.lucide) window.lucide.createIcons();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar);
  } else {
    inicializar();
  }
})();
