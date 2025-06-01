// src/components/loans/IssueLoan.js
import React, { useState, useEffect } from 'react';
import { issueLoan } from '../../api/loans';
import { getAllBooks } from '../../api/books';
import { getAllBorrowers } from '../../api/borrowers';

function IssueLoan() {
    const [bookId, setBookId] = useState('');
    const [borrowerId, setBorrowerId] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [books, setBooks] = useState([]);
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                const [booksData, borrowersData] = await Promise.all([getAllBooks(), getAllBorrowers()]);
                setBooks(booksData);
                setBorrowers(borrowersData);
            } catch (err) {
                setError(err.message || 'Failed to load books or borrowers.');
            } finally {
                setLoading(false);
            }
        };
        fetchDependencies();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!bookId || !borrowerId || !dueDate) {
            setError('All fields are required.');
            return;
        }

        try {
            const loanData = {
                bookId: bookId,
                borrowerId: borrowerId,
                dueDate: new Date(dueDate).toISOString(), // Ensure ISO format for backend
            };
            await issueLoan(loanData);
            setMessage('Loan issued successfully!');
            setBookId('');
            setBorrowerId('');
            setDueDate('');
        } catch (err) {
            setError(err.message || 'Failed to issue loan.');
        }
    };

    if (loading) return <div className="text-center p-4">Loading form data...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md max-w-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Issue New Loan</h2>

            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Book:</label>
                    <select value={bookId} onChange={(e) => setBookId(e.target.value)} required
                        className="shadow border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select a Book</option>
                        {books.map((book) => (
                            <option key={book.id} value={book.id}>{book.title} by {book.author}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Borrower:</label>
                    <select value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)} required
                        className="shadow border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select a Borrower</option>
                        {borrowers.map((borrower) => (
                            <option key={borrower.id} value={borrower.id}>{borrower.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Due Date:</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required
                        className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
                    Issue Loan
                </button>
            </form>
        </div>
    );
}

export default IssueLoan;