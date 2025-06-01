// src/components/books/BookList.js
import React, { useState, useEffect } from 'react';
import { getAllBooks } from '../../api/books';

function BookList() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks();
                setBooks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    if (loading) return <div className="text-center p-4">Loading books...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Books</h2>
            {books.length === 0 ? (
                <p className="text-center text-gray-600">No books available in the library.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Title</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Author</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">ISBN</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Pub. Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="py-3 px-4 border-b text-gray-800">{book.title}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{book.author}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{book.isbn}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{book.publicationYear}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BookList;