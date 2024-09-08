let booksData = [];
let currentPage = 1;
const booksPerPage = 3; 

document.addEventListener('DOMContentLoaded', function () {
    fetchBooks();
});

function fetchBooks() {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; 

    fetch('books.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            booksData = data;
            displayBooks(booksData);
            createPagination(booksData);
        })
        .catch(error => {
            console.error('Error fetching the book data:', error);
            displayError('Failed to load books. Please try again later.');
        })
        .finally(() => {
            loader.style.display = 'none'; // Hide loader
        });
}

function displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; 

    const startIndex = (currentPage - 1) * booksPerPage;
    const endIndex = startIndex + booksPerPage;
    const paginatedBooks = books.slice(startIndex, endIndex);

    paginatedBooks.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'book-item';
        bookElement.textContent = `${book.title} by ${book.author}`;
        bookList.appendChild(bookElement);
    });
}

function sortBooks(criteria) {
    const sortedBooks = [...booksData].sort((a, b) => a[criteria].localeCompare(b[criteria]));
    displayBooks(sortedBooks);
    createPagination(sortedBooks);
}

function filterBooks(query) {
    const filteredBooks = booksData.filter(book => book.title.toLowerCase().includes(query.toLowerCase()));
    displayBooks(filteredBooks);
    createPagination(filteredBooks);
}

function createPagination(books) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination

    const totalPages = Math.ceil(books.length / booksPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayBooks(books);
        };
        pagination.appendChild(pageButton);
    }
}

function displayError(message) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = `<p class="error">${message}</p>`;
}
