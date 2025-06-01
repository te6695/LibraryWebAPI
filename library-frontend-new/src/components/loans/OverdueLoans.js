// src/components/loans/OverdueLoans.js
import React, { useState, useEffect } from 'react';
import { getOverdueLoans } from '../../api/loans';

function OverdueLoans() {
    const [overdueLoans, setOverdueLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOverdueLoans = async () => {
            try {
                const data = await getOverdueLoans();
                setOverdueLoans(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOverdueLoans();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) return <div className="text-center p-4">Loading overdue loans...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Overdue Loans</h2>
            {overdueLoans.length === 0 ? (
                <p className="text-center text-gray-600">No overdue loans found. Good job!</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Book Title</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Borrower Name</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Issue Date</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdueLoans.map((loan) => (
                                <tr key={loan.id} className="bg-red-50 hover:bg-red-100 transition-colors duration-200">
                                    <td className="py-3 px-4 border-b text-red-800">{loan.book?.title || 'N/A'}</td>
                                    <td className="py-3 px-4 border-b text-red-800">{loan.borrower?.name || 'N/A'}</td>
                                    <td className="py-3 px-4 border-b text-red-800">{formatDate(loan.issueDate)}</td>
                                    <td className="py-3 px-4 border-b text-red-800">{formatDate(loan.dueDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default OverdueLoans;