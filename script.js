document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const resultsContainer = document.getElementById("results-container");
  const loader = document.getElementById("loader");

  // Função para buscar livros
  async function searchBooks(title, author, subject) {
    // Mostrar loader
    loader.style.display = "block";
    resultsContainer.innerHTML = "";

    try {
      // Construir a query da API
      let query = "";
      if (title) query += `title=${encodeURIComponent(title)}&`;
      if (author) query += `author=${encodeURIComponent(author)}&`;
      if (subject) query += `subject=${encodeURIComponent(subject)}&`;

      // Fazer requisição para a API
      const response = await fetch(
        `https://openlibrary.org/search.json?${query}limit=20`
      );
      const data = await response.json();

      // Esconder loader
      loader.style.display = "none";

      // Verificar se a requisição foi bem-sucedida
      if (!data.docs || data.docs.length === 0) {
        resultsContainer.innerHTML = `
                    <div class="no-results">
                        <h2>Nenhum livro encontrado</h2>
                        <p>Tente ajustar os termos da sua busca.</p>
                    </div>
                `;
        return;
      }

      // Exibir os resultados
      displayBooks(data.docs);
    } catch (error) {
      // Esconder loader e mostrar mensagem de erro
      loader.style.display = "none";
      resultsContainer.innerHTML = `
                <div class="no-results">
                    <h2>Erro na busca</h2>
                    <p>Ocorreu um erro ao buscar livros. Verifique sua conexão e tente novamente.</p>
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

      const title = book.title ? book.title : "Título desconhecido";
      const author = book.author_name
        ? book.author_name.join(", ")
        : "Autor desconhecido";
      const subjects = book.subject ? book.subject.slice(0, 5) : [];

      const bookElement = document.createElement("div");
      bookElement.className = "book-card fade-in";
      bookElement.innerHTML = `
                <div class="book-cover">
                    ${
                      coverUrl
                        ? `<img src="${coverUrl}" alt="${title}">`
                        : `<div class="no-cover">Capa não disponível</div>`
                    }
                </div>
                <div class="book-info">
                    <h3 class="book-title">${title}</h3>
                    <p class="book-author">Por: ${author}</p>
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

  // Adicionar evento de envio ao formulário
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const subject = document.getElementById("subject").value;

    // Verificar se pelo menos um campo foi preenchido
    if (!title && !author && !subject) {
      alert("Por favor, preencha pelo menos um campo de busca.");
      return;
    }

    // Buscar livros
    searchBooks(title, author, subject);
  });

  // Buscar alguns livros iniciais
  searchBooks("javascript", "", "programming");
});
