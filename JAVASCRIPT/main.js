document.addEventListener("DOMContentLoaded", () => {
  const artistInput = document.getElementById("artistName");
  const searchButton = document.querySelector("button");

  const artistTitleElement = document.getElementById("artist-title");
  const bioElement = document.getElementById("bio");
  const albumsListElement = document.getElementById("albums-list");

  // Chave da sua API da Last.fm
  const apiKey = "ce5fd9d400dd5b3d4e7c4927bd42a8c4";

  async function searchArtist() {
    const artistName = artistInput.value.trim();

    if (!artistName) {
      alert("Por favor, digite o nome do artista.");
      return;
    }

    // Limpa os resultados anteriores
    artistTitleElement.textContent = "";
    bioElement.textContent = "";
    albumsListElement.innerHTML = "";

    artistTitleElement.textContent = "Buscando...";

    try {
      const bioUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
        artistName
      )}&api_key=${apiKey}&format=json`;
      const albumsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
        artistName
      )}&api_key=${apiKey}&format=json`;

      const [bioResponse, albumsResponse] = await Promise.all([
        fetch(bioUrl),
        fetch(albumsUrl),
      ]);

      const bioData = await bioResponse.json();
      const albumsData = await albumsResponse.json();

      if (bioData.artist) {
        artistTitleElement.textContent = bioData.artist.name;
        // Limpa as tags HTML da biografia
        bioElement.textContent = bioData.artist.bio.summary
          .replace(/<a.*?>/g, "")
          .replace(/<\/a>/g, "");
      } else {
        artistTitleElement.textContent = `Artista não encontrado.`;
      }

      if (albumsData.topalbums && albumsData.topalbums.album.length > 0) {
        albumsData.topalbums.album.forEach((album) => {
          const albumItem = document.createElement("div");
          albumItem.className = "album-item";
          albumItem.innerHTML = `
            <img src="${album.image[2]["#text"]}" alt="Capa do álbum">
            <p>${album.name}</p>
          `;
          albumsListElement.appendChild(albumItem);
        });
      }
    } catch (error) {
      console.error("Erro:", error);
      artistTitleElement.textContent = "Ocorreu um erro ao buscar os dados.";
    }
  }

  searchButton.addEventListener("click", searchArtist);
});
