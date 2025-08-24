document.addEventListener("DOMContentLoaded", () => {
  const formBusca = document.getElementById("search-form");
  const inputBusca = document.getElementById("search-input");
  const areaResultados = document.getElementById("results-container");

  formBusca.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const termoBusca = inputBusca.value.trim();

    if (termoBusca === "") {
      areaResultados.innerHTML =
        "<p class='status-message'>Por favor, digite um nome, autor ou gênero.</p>";
      return;
    }

    areaResultados.innerHTML =
      "<p class='status-message'>Buscando livros... aguarde um momento!</p>";

    try {
      const resposta = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          termoBusca
        )}`
      );
      const dados = await resposta.json();
      const livrosEncontrados = dados.docs;

      areaResultados.innerHTML = "";

      if (livrosEncontrados.length === 0) {
        areaResultados.innerHTML =
          "<p class='status-message'>Não achei nenhum livro. Tente uma busca diferente!</p>";
        return;
      }

      livrosEncontrados.forEach((livro) => {
        const idCapa = livro.cover_i;
        const urlCapa = idCapa
          ? `https://covers.openlibrary.org/b/id/${idCapa}-M.jpg`
          : "https://placehold.co/150x200/cccccc/333333?text=Sem+Capa";

        const autores =
          livro.author_name && livro.author_name.length > 0
            ? livro.author_name.join(", ")
            : "Autor desconhecido";
        const ano = livro.first_publish_year
          ? `(${livro.first_publish_year})`
          : "";

        const fichaLivro = document.createElement("div");
        fichaLivro.classList.add("book-card");
        fichaLivro.innerHTML = `
          <img src="${urlCapa}" alt="Capa do livro ${livro.title}" class="book-cover">
          <div class="book-info">
            <h3>${livro.title}</h3>
            <p><strong>Autor(es):</strong> ${autores}</p>
            <p><strong>Ano:</strong> ${ano}</p>
          </div>
        `;
        areaResultados.appendChild(fichaLivro);
      });
    } catch (error) {
      areaResultados.innerHTML =
        "<p class='status-message'>Ocorreu um erro ao buscar os livros. Por favor, tente novamente.</p>";
      console.error("Erro na busca:", error);
    }
  });
});
