
const express = require('express');
const app = express();

app.use(express.json());

let books = [];

let nextId = 1;

app.post('/api/books', (req, res) => {
    const { title, author, genre, totalCopies } = req.body;

    if (!title || !author || !genre ||
        !Number.isInteger(totalCopies) || totalCopies <= 0) {
        return res.status(400).json({
            message: "Enter valid book details and copies"
        });
    }

    const newBook = {
        id: nextId++,
        title,
        author,
        genre,
        totalCopies,
        availableCopies: totalCopies,
        issuedCopies: 0
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


app.get('/api/books', (req, res) => {
    res.json(books);
});


app.get('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.json(book);
});


app.put('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, genre, totalCopies } = req.body;

    if (title !== undefined) {
        if (typeof title !== 'string' || !title.trim())
            return res.status(400).json({ message: "Invalid title" });
        book.title = title;
    }

    if (author !== undefined) {
        if (typeof author !== 'string' || !author.trim())
            return res.status(400).json({ message: "Invalid author" });
        book.author = author;
    }

    if (genre !== undefined) {
        if (typeof genre !== 'string' || !genre.trim())
            return res.status(400).json({ message: "Invalid genre" });
        book.genre = genre;
    }

    if (totalCopies !== undefined) {
        if (!Number.isInteger(totalCopies) ||
            totalCopies < book.issuedCopies) {
            return res.status(400).json({
                message: "Total copies cannot be less than issued copies"
            });
        }

        book.totalCopies = totalCopies;
        book.availableCopies = totalCopies - book.issuedCopies;
    }

    res.json({
        message: "Book updated successfully",
        book
    });
});


app.delete('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (books[index].issuedCopies > 0) {
        return res.status(409).json({
            message: "Cannot delete a book with issued copies"
        });
    }

    books.splice(index, 1);

    res.json({
        message: "Book deleted successfully"
    });
});



app.listen(3000, () => {
    console.log("Library Management API running on port 3000");
});
