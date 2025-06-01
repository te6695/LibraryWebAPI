// src/components/borrowers/BorrowerList.js
import React, { useState, useEffect } from 'react';
import { getAllBorrowers } from '../../api/borrowers';

function BorrowerList() {
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBorrowers = async () => {
            try {
                const data = await getAllBorrowers();
                setBorrowers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchBorrowers();
    }, []);

    if (loading) return <div className="text-center p-4">Loading borrowers...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Borrowers</h2>
            {borrowers.length === 0 ? (
                <p className="text-center text-gray-600">No borrowers registered.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Contact Info</th>
                                {/* Add more borrower fields as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {borrowers.map((borrower) => (
                                <tr key={borrower.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="py-3 px-4 border-b text-gray-800">{borrower.name}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{borrower.contactInfo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default BorrowerList;