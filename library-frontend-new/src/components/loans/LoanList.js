// src/components/loans/LoanList.js
import React, { useState, useEffect } from 'react';
import { getAllLoans, returnLoan } from '../../api/loans';

function LoanList() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const data = await getAllLoans();
            setLoans(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (loanId) => {
        if (window.confirm('Are you sure you want to mark this loan as returned?')) {
            setMessage('');
            setError('');
            try {
                await returnLoan(loanId);
                setMessage('Loan marked as returned successfully!');
                fetchLoans(); // Refresh list
            } catch (err) {
                setError(err.message || 'Failed to mark loan as returned.');
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="text-center p-4">Loading loans...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Loans</h2>

            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            {loans.length === 0 ? (
                <p className="text-center text-gray-600">No active loans found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Book Title</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Borrower Name</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Issue Date</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Due Date</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Return Date</th>
                                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="py-3 px-4 border-b text-gray-800">{loan.book?.title || 'N/A'}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{loan.borrower?.name || 'N/A'}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{formatDate(loan.issueDate)}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{formatDate(loan.dueDate)}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{formatDate(loan.returnDate)}</td>
                                    <td className="py-3 px-4 border-b text-center">
                                        {!loan.returnDate && ( // Only show return button if not returned
                                            <button onClick={() => handleReturn(loan.id)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 shadow-sm">
                                                Return
                                            </button>
                                        )}
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

export default LoanList;