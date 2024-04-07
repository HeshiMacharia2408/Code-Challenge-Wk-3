document.addEventListener("DOMContentLoaded", function() {
    const filmsList = document.getElementById('films');
    const buyButton = document.getElementById('buy-ticket');

    // Function to obtain movie data
    function fetchMovies() {
        return fetch('/films')
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching movies:', error);
                return [];
            });
    }

    // Function used to display movies in the menu
    function displayMovies(movies) {
        filmsList.innerHTML = '';
        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = movie.title;
            if (movie.tickets_sold === movie.capacity) {
                listItem.classList.add('sold-out');
                listItem.textContent += ' (Sold Out)';
            }
            filmsList.appendChild(listItem);
        });
    }

    // Function used to fetch and display details of the first movie
    function displayMovieDetails() {
        fetch('/films/1')
            .then(response => response.json())
            .then(movie => {
                const availableTickets = movie.capacity - movie.tickets_sold;
                // Display movie details on the frontend
                document.getElementById('movie-poster').src = movie.poster;
                document.getElementById('movie-title').textContent = movie.title;
                document.getElementById('movie-runtime').textContent = `Runtime: ${movie.runtime} mins`;
                document.getElementById('movie-showtime').textContent = `Showtime: ${movie.showtime}`;
                document.getElementById('available-tickets').textContent = `Available Tickets: ${availableTickets}`;
            })
            .catch(error => console.error('Error fetching first movie details:', error));
    }

    // Function used to purchase a ticket
    function buyTicket(movieId) {
        fetch(`/films/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tickets_sold: 1 
            })
        })
        .then(response => {
            if (response.ok) {
                const availableTicketsElement = document.getElementById('available-tickets');
                const availableTickets = parseInt(availableTicketsElement.textContent.split(':')[1].trim()) - 1;
                availableTicketsElement.textContent = `Available Tickets: ${availableTickets}`;
            } else {
                console.error('Failed to purchase ticket');
            }
        })
        .catch(error => console.error('Error buying ticket:', error));
    }

    // Event listener used to handle purchasing of tickets
    buyButton.addEventListener('click', function() {
        const movieId = 1; // Assuming movie ID 1 is the first movie
        buyTicket(movieId);
    });

    fetchMovies().then(displayMovies);
    displayFirstMovieDetails();
});