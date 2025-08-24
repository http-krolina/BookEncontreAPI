document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("results-container");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Impede o envio do formulário padrão

    const query = searchInput.value.trim();
    if (query === "") {
      alert("Por favor, digite o nome de um livro.");
      return;
    }

    resultsContainer.innerHTML = "<p>Buscando livros...</p>";

    try {
      const books = await searchBooks(query);
      displayBooks(books);
    } catch (error) {
      resultsContainer.innerHTML =
        "<p>Ocorreu um erro ao buscar os livros. Por favor, tente novamente.</p>";
      console.error("Erro na busca:", error);
    }
  });

  /**
   * Função que faz a chamada à API Open Library para buscar livros.
   * @param {string} query - O termo de busca (título do livro).
   * @returns {Array<Object>} Uma lista de objetos de livros.
   */
  async function searchBooks(query) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro de rede: ${response.status}`);
    }

    const data = await response.json();
    // A API retorna os resultados em data.docs
    return data.docs;
  }

  /**
   * Função que exibe os livros na página.
   * @param {Array<Object>} books - A lista de livros a ser exibida.
   */
  function displayBooks(books) {
    resultsContainer.innerHTML = ""; // Limpa os resultados anteriores

    if (books.length === 0) {
      resultsContainer.innerHTML =
        "<p>Nenhum livro encontrado. Tente um termo de busca diferente.</p>";
      return;
    }

    books.forEach((book) => {
      // A API usa 'key' para identificar a capa.
      const coverId = book.cover_edition_key || book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/olid/${coverId}-M.jpg`
        : "https://via.placeholder.com/150x200?text=Sem+Capa";

      const authors = book.author_name
        ? book.author_name.join(", ")
        : "Autor desconhecido";
      const year = book.first_publish_year
        ? `(${book.first_publish_year})`
        : "";

      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");
      bookCard.innerHTML = `
                <img src="${coverUrl}" alt="Capa do livro ${book.title}" class="book-cover">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p><strong>Autor(es):</strong> ${authors}</p>
                    <p><strong>Ano:</strong> ${year}</p>
                </div>
            `;
      resultsContainer.appendChild(bookCard);
    });
  }
});
