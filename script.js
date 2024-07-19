//Book Class : Represent a Book

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class : Handle UI Tasks
class UI {
    static displayBooks() {

        const books = Store.getBooks();

        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
       <td>${book.title}</td>
       <td>${book.author}</td>
       <td>${book.isbn}</td>
       <td> <a href="#" class="delete"> x </a></td>       
       `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = ` ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(),
            3000);
        setTimeout(() => document.querySelector('.success').remove(),
            3000);
    }

    static clearFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#author').value = "";
        document.querySelector('#isbn').value = "";
    }
}

//Store class : Handles Storage

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBooks(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event : Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks)


//Event: Add a Book

document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    //Get Form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    //validate 
    if (title == '' || author == '' || isbn == '') {
        UI.showAlert("Please fill in all fields", 'alert');
    } else {

        // Instatiate Book
        const book = new Book(title, author, isbn);

        //Add book to UI
        UI.addBookToList(book);

        //Add book to Store
        Store.addBooks(book);

        // show Success message
        UI.showAlert('Book Added', 'success')

        //clear fields
        UI.clearFields();

    }

});

//Event : Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {

    //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book feom store
    Store.removeBooks(e.target.parentElement);

    // show delete Book
    UI.showAlert('Book Removed', 'success');
})