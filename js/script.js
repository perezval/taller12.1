// Definir la variable global
let moviesData = [];

document.addEventListener('DOMContentLoaded', () => {
fetch('https://japceibal.github.io/japflix_api/movies-data.json')
  .then(response => response.json())
  .then(data => {
    //Los datos obtenidos en formato JSON se almacenan en la variable data. Aquí, los estamos almacenando en una variable global llamada window.moviesData para poder acceder a ellos desde cualquier parte de nuestro código.
    moviesData = data;
  });


  const searchInput = document.getElementById('inputBuscar');
  const searchButton = document.getElementById('btnBuscar');
  const movieList = document.getElementById('lista');
  

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value.toLowerCase();

    // Filtrar las películas según el término de búsqueda
    const filteredMovies = moviesData.filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm) ||
          movie.genres.some(genre => genre.name.toLowerCase().includes(searchTerm)) ||
          (movie.tagline && movie.tagline.toLowerCase().includes(searchTerm)) || 
          (movie.overview && movie.overview.toLowerCase().includes(searchTerm));
      });
  
        // Limpiar la lista antes de agregar nuevos elementos
        movieList.innerHTML = '';
  
        
        // Renderizar los resultados
        filteredMovies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item', 'bg-dark', 'text-light');
  
        listItem.addEventListener('click', () => {
          showMovieDetails(movie);
        });
  

        // Cómo se muestran los resultados
        listItem.innerHTML = `
        <strong>${movie.title}</strong>
        <p>${movie.tagline}</p>
        <div class="star-rating">
            ${createStarRating(movie.vote_average)}
        </div>
        `;

        movieList.appendChild(listItem);
        });
    });
});


// Definir la función createStarRating para generar estrellas según la votación
function createStarRating(vote) {
    const maxStars = 5;
    let fullStars = Math.round(vote / 2);
    let starHTML = '';
  
    for (let i = 0; i < maxStars; i++) {
      if (i < fullStars) {
        starHTML += `<span class="fa fa-star checked text-warning"></span>`;
      } else {
        starHTML += `<span class="fa fa-star text-secondary"></span>`;
      }
    }
  
    return starHTML;
  }
  
  
  function showMovieDetails(movie) {
    const offcanvasElement = document.querySelector('.offcanvas-body');
  
    // Mostrar detalles de la película
    offcanvasElement.innerHTML = `
      <h5>${movie.title}</h5>
      <p>${movie.overview}</p>
      <ul>
        ${movie.genres.map(genre => `<li>${genre.name}</li>`).join('')}
      </ul>
      <div class="dropdown mt-3">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          Más detalles
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Year: ${movie.release_date.split('-')[0]}</a></li>
          <li><a class="dropdown-item" href="#">Runtime: ${movie.runtime} mins</a></li>
          <li><a class="dropdown-item" href="#">Budget: $${movie.budget.toLocaleString()}</a></li>
          <li><a class="dropdown-item" href="#">Revenue: $${movie.revenue.toLocaleString()}</a></li>
        </ul>
      </div>
    `;
  
    // Crear el panel offcanvas para mostrarlo
    const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
    offcanvas.show();
  }
