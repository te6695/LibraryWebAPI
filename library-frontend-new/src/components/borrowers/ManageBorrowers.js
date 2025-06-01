// src/components/borrowers/ManageBorrowers.js
import React, { useState, useEffect } from 'react';
import { getAllBorrowers, addBorrower, updateBorrower, deleteBorrower } from '../../api/borrowers';

function ManageBorrowers() {
    const [borrowers, setBorrowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const [isAdding, setIsAdding] = useState(false);
    const [editingBorrowerId, setEditingBorrowerId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contactInfo: '',
    });

    useEffect(() => {
        fetchBorrowers();
    }, []);

    const fetchBorrowers = async () => {
        try {
            setLoading(true);
            const data = await getAllBorrowers();
            setBorrowers(data);
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
            await addBorrower(formData);
            setMessage('Borrower added successfully!');
            setFormData({ name: '', contactInfo: '' });
            setIsAdding(false);
            fetchBorrowers(); // Refresh list
        } catch (err) {
            setError(err.message || 'Failed to add borrower.');
        }
    };

    const handleEditClick = (borrower) => {
        setEditingBorrowerId(borrower.id);
        setFormData({
            name: borrower.name,
            contactInfo: borrower.contactInfo,
        });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await updateBorrower(editingBorrowerId, formData);
            setMessage('Borrower updated successfully!');
            setEditingBorrowerId(null);
            setFormData({ name: '', contactInfo: '' });
            fetchBorrowers(); // Refresh list
        } catch (err) {
            setError(err.message || 'Failed to update borrower.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this borrower?')) {
            setMessage('');
            setError('');
            try {
                await deleteBorrower(id);
                setMessage('Borrower deleted successfully!');
                fetchBorrowers(); // Refresh list
            } catch (err) {
                setError(err.message || 'Failed to delete borrower.');
            }
        }
    };

    if (loading) return <div className="text-center p-4">Loading borrowers...</div>;
    if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Manage Borrowers</h2>

            {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <button
                onClick={() => { setIsAdding(!isAdding); setEditingBorrowerId(null); setFormData({ name: '', contactInfo: '' }); }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-6 transition duration-300 shadow-md"
            >
                {isAdding ? 'Cancel Add' : 'Add New Borrower'}
            </button>

            {(isAdding || editingBorrowerId) && (
                <form onSubmit={isAdding ? handleAddSubmit : handleUpdateSubmit} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-8">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4">{isAdding ? 'Add Borrower' : 'Edit Borrower'}</h3>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Contact Info:</label>
                            <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required
                                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
                        {isAdding ? 'Add Borrower' : 'Update Borrower'}
                    </button>
                    {editingBorrowerId && (
                        <button type="button" onClick={() => { setEditingBorrowerId(null); setIsAdding(false); setFormData({ name: '', contactInfo: '' }); }}
                            className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-md">
                            Cancel
                        </button>
                    )}
                </form>
            )}

            {borrowers.length === 0 ? (
                <p className="text-center text-gray-600">No borrowers available to manage.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-700">Contact Info</th>
                                <th className="py-3 px-4 border-b text-center text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowers.map((borrower) => (
                                <tr key={borrower.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="py-3 px-4 border-b text-gray-800">{borrower.name}</td>
                                    <td className="py-3 px-4 border-b text-gray-800">{borrower.contactInfo}</td>
                                    <td className="py-3 px-4 border-b text-center">
                                        <button onClick={() => handleEditClick(borrower)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300 shadow-sm">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(borrower.id)}
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

export default ManageBorrowers;