// src/components/books/ManageBooks.js
import React, { useState, useEffect } from 'react';
import { getAllBooks, addBook, updateBook, deleteBook } from '../../api/books';

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [isAdding, setIsAdding] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        publicationYear: '',
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await getAllBooks();
            setBooks(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await addBook({ ...formData, publicationYear: parseInt(formData.publicationYear, 10) });
            setMessage('Book added successfully!');
            setFormData({ title: '', author: '', isbn: '', publicationYear: '' });
            setIsAdding(false);
            fetchBooks(); // Refresh list
        } catch (err) {
            setError(err.message || 'Failed to add book.');
        }
    };

    const handleEditClick = (book) => {
        setEditingBookId(book.id);
        setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publicationYear: book.publicationYear,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await updateBook(editingBookId, { ...formData, publicationYear: parseInt(formData.publicationYear, 10) });
            setMessage('Book updated successfully!');
            setEditingBookId(null);
            setFormData({ title: '', author: '', isbn: '', publicationYear: '' });
            fetchBooks(); // Refresh list
        } catch (err) {
            setError(err.message || 'Failed to update book.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            setMessage('');
            setError('');
            try {
                await deleteBook(id);
                setMessage('Book deleted successfully!');
                fetchBooks(); // Refresh list
            } catch (err) {
                setError(err.message || 'Failed to delete book.');
            }
        }
    };

    if (loading) return <div className="text-center p-4">Loading books...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Books</h2>

            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <button
                onClick={() => { setIsAdding(!isAdding); setEditingBookId(null); setFormData({ title: '', author: '', isbn: '', publicationYear: '' }); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-6 transition duration-300 shadow-md"
            >
                {isAdding ? 'Cancel Add' : 'Add New Book'}
            </button>

            {(isAdding || editingBookId) && (
                <form onSubmit={isAdding ? handleAddSubmit : handleUpdateSubmit} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">{isAdding ? 'Add Book' : 'Edit Book'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required
                                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Author:</label>
                            <input type="text" name="author" value={formData.author} onChange={handleChange} required
                                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">ISBN:</label>
                            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} required
                                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Publication Year:</label>
                            <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} required
                                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
                        {isAdding ? 'Add Book' : 'Update Book'}
                    </button>
                    {editingBookId && (
                        <button type="button" onClick={() => { setEditingBookId(null); setIsAdding(false); setFormData({ title: '', author: '', isbn: '', publicationYear: '' }); }}
                            className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
                            Cancel
                        </button>
                    )}
                </form>
            )}

            {books.length === 0 ? (
                <p className="text-center text-gray-600">No books available to manage.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Title</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Author</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">ISBN</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Year</th>
                                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="py-3 px-4 border-b text-gray-800">{book.title}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{book.author}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{book.isbn}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{book.publicationYear}</td>
                                    <td className="py-3 px-4 border-b text-center">
                                        <button onClick={() => handleEditClick(book)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 shadow-sm">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(book.id)}
                                            className="ml-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 shadow-sm">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageBooks;