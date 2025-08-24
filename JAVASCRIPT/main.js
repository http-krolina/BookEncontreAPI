document.addEventListener("DOMContentLoaded", () => {
  const artistTitleElement = document.getElementById("artist-title");
  const bioElement = document.getElementById("bio");
  const albumsListElement = document.getElementById("albums-list");
  const topAlbumsContainer = document.getElementById("top-albums-container");

  window.searchArtist = async (artistName) => {
    if (!artistName) {
      alert("Por favor, digite o nome de um artista.");
      return;
    }

    const apiKey = "SUA_CHAVE_AQUI"; // <-- Insira sua chave de API da Last.fm aqui
    const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${encodeURIComponent(
      artistName
    )}&api_key=${apiKey}&format=json`;

    artistTitleElement.textContent = "Buscando...";
    bioElement.textContent = "";
    albumsListElement.innerHTML = "";
    topAlbumsContainer.style.display = "none";

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.topalbums && data.topalbums.album.length > 0) {
        const artist = data.topalbums["@attr"].artist;
        artistTitleElement.textContent = artist;

        // Aqui você pode fazer uma segunda chamada de API para a biografia
        const bioApiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
          artistName
        )}&api_key=${apiKey}&format=json`;
        const bioResponse = await fetch(bioApiUrl);
        const bioData = await bioResponse.json();

        if (bioData.artist && bioData.artist.bio) {
          // Remove tags HTML e formata a biografia
          bioElement.textContent = bioData.artist.bio.summary
            .replace(/<a.*?>/g, "")
            .replace(/<\/a>/g, "");
        }

        data.topalbums.album.forEach((album) => {
          const albumItem = document.createElement("div");
          albumItem.className = "album-item";
          albumItem.innerHTML = `
                        <img src="${
                          album.image[2]["#text"] ||
                          "https://via.placeholder.com/150"
                        }" alt="Capa do álbum">
                        <p>${album.name}</p>
                    `;
          albumsListElement.appendChild(albumItem);
        });

        topAlbumsContainer.style.display = "block";
      } else {
        artistTitleElement.textContent =
          "Artista não encontrado ou sem álbuns populares.";
        albumsListElement.innerHTML = "";
        topAlbumsContainer.style.display = "none";
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      artistTitleElement.textContent =
        "Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.";
      albumsListElement.innerHTML = "";
      topAlbumsContainer.style.display = "none";
    }
  };
});
