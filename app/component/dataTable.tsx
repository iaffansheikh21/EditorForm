// components/DataTable.js

import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataTable = ({ data, setData, setEditingData } : any) => {
  const handleDelete = async (id : any) => {
    try {
      const response = await axios.delete('/api/deleteData', { data: { id } });
      if (response.status === 200) {
        setData(data.filter((row: { data_id: any; }) => row.data_id !== id));
        toast.success('Item deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Error deleting item');
    }
  };

  const handleEdit = (row : any) => {
    setEditingData({
      id: row.data_id,
      title: row.title,
      description: row.description,
      imageString: row.imageString,
    });
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Fetched Data</h2>
      <div className="overflow-x-hidden">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row : any) => (
              <tr key={row.data_id}>
                <td className="py-3 px-4 border-b border-gray-200">{row.data_id}</td>
                <td className="py-3 px-4 border-b border-gray-200">{row.title}</td>
                <td className="py-3 px-4 border-b border-gray-200">{row.description}</td>
                <td className="py-3 px-4 border-b border-gray-200">
                  {row.imageString ? (
                    <img src={row.imageString} alt="Image" className="h-20 w-auto object-contain" />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td className="py-3 px-4 border-b border-gray-200">{new Date(row.created_date).toLocaleString()}</td>
                <td className="py-3 px-4 border-b border-gray-200 flex justify-between">
                  <button
                    onClick={() => handleEdit(row)}
                    className="py-1 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(row.data_id)}
                    className="py-1 px-4 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;