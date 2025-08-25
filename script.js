document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results-container");
  const resultsInfo = document.getElementById("results-info");
  const loader = document.getElementById("loader");

  // Função para traduzir gêneros comuns para português
  function translateGenre(genre) {
    const genreMap = {
      fiction: "Ficção",
      "science fiction": "Ficção Científica",
      fantasy: "Fantasia",
      romance: "Romance",
      mystery: "Mistério",
      thriller: "Suspense",
      horror: "Terror",
      biography: "Biografia",
      history: "História",
      science: "Ciência",
      philosophy: "Filosofia",
      poetry: "Poesia",
      drama: "Drama",
      comedy: "Comédia",
      adventure: "Aventura",
      children: "Infantil",
      "young adult": "Juvenil",
      classic: "Clássico",
      crime: "Crime",
      nonfiction: "Não-Ficção",
    };

    return genreMap[genre.toLowerCase()] || genre;
  }

  // Função para formatar dados em português
  function formatData(data) {
    if (!data) return "Não disponível";

    // Se for um array, juntar os itens com vírgula
    if (Array.isArray(data)) {
      return data.join(", ");
    }

    return data;
  }

  // Função para exibir os livros na página
  function displayBooks(books) {
    resultsContainer.innerHTML = "";

    books.forEach((book) => {
      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : null;

      const title = book.title ? book.title : "Título desconhecido";
      const author = book.author_name
        ? book.author_name.join(", ")
        : "Autor desconhecido";
      const subjects = book.subject ? book.subject.slice(0, 5) : [];
      const publishYear = book.first_publish_year
        ? book.first_publish_year
        : "Ano desconhecido";

      const bookElement = document.createElement("div");
      bookElement.className = "book-card fade-in";
      bookElement.innerHTML = `
                <div class="book-cover">
                    ${
                      coverUrl
                        ? `<img src="${coverUrl}" alt="${title}">`
                        : `<div class="no-cover">Capa indisponível</div>`
                    }
                </div>
                <div class="book-info">
                    <h3 class="book-title">${title}</h3>
                    <p class="book-author">Por: ${author}</p>
                    <p class="book-year">Publicação: ${publishYear}</p>
                    ${
                      subjects.length > 0
                        ? `
                        <div class="book-subjects">
                            ${subjects
                              .map(
                                (subject) =>
                                  `<span class="subject-tag">${subject}</span>`
                              )
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                </div>
            `;

      resultsContainer.appendChild(bookElement);
    });
  }

  // Função para buscar livros
  async function searchBooks(query) {
    // Mostrar loader
    loader.style.display = "block";
    resultsContainer.innerHTML = "";
    resultsInfo.style.display = "none";

    try {
      // Fazer requisição para a API
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&limit=24`
      );
      const data = await response.json();

      // Esconder loader
      loader.style.display = "none";

      // Verificar se a requisição foi bem-sucedida
      if (!data.docs || data.docs.length === 0) {
        resultsContainer.innerHTML = `
                    <div class="no-results">
                        <h2>Nenhum livro encontrado</h2>
                        <p>Tente usar termos diferentes na sua busca.</p>
                    </div>
                `;
        return;
      }

      // Mostrar informações sobre os resultados
      resultsInfo.style.display = "block";
      resultsInfo.innerHTML = `
                <p>Exibindo <strong>${data.docs.length}</strong> resultados para: <strong>"${query}"</strong></p>
            `;

      // Exibir os resultados
      displayBooks(data.docs);
    } catch (error) {
      // Esconder loader e mostrar mensagem de erro
      loader.style.display = "none";
      resultsContainer.innerHTML = `
                <div class="no-results">
                  <h2>Ocorreu um erro ao buscar os livros! Tente novamente.</h2>
                
                </div>
            `;
      console.error("Erro:", error);
    }
  }

  // Função para exibir os livros na página
  function displayBooks(books) {
    resultsContainer.innerHTML = "";

    books.forEach((book) => {
      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : null;

      const title = formatData(book.title);
      const author = formatData(book.author_name);
      const publishYear = book.first_publish_year
        ? book.first_publish_year
        : "Ano desconhecido";

      // Traduzir gêneros para português
      let subjects = [];
      if (book.subject) {
        subjects = book.subject
          .slice(0, 5)
          .map((subject) => translateGenre(subject));
      }

      const bookElement = document.createElement("div");
      bookElement.className = "book-card fade-in";
      bookElement.innerHTML = `
                <div class="book-cover">
                    ${
                      coverUrl
                        ? `<img src="${coverUrl}" alt="${title}">`
                        : `<div class="no-cover">Capa indisponível</div>`
                    }
                </div>
                <div class="book-info">
                    <h3 class="book-title">${title}</h3>
                    <p class="book-author"><strong>Autor:</strong> ${author}</p>
                    <p class="book-year"><strong>Publicação:</strong> ${publishYear}</p>
                    ${
                      subjects.length > 0
                        ? `
                        <div class="book-subjects">
                            <strong>Gêneros:</strong> 
                            ${subjects
                              .map(
                                (subject) =>
                                  `<span class="subject-tag">${subject}</span>`
                              )
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                </div>
            `;

      resultsContainer.appendChild(bookElement);
    });
  }

  // Adicionar evento de envio ao formulário
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const query = searchInput.value.trim();

    // Verificar se o campo foi preenchido
    if (!query) {
      alert("Por favor, digite algo para buscar.");
      return;
    }

    // Buscar livros
    searchBooks(query);
  });

  // Buscar alguns livros iniciais de autores brasileiros
  searchBooks("Suspense");
});
