"use client"
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import DataTable from './dataTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EditorForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [data, setData] = useState<{ id: number }[]>([]);
  const [editingData, setEditingData] = useState<{ id: number } | null>(null);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (upload: any) => {
        setImage(upload.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const imageString = image ? image : '';
    const payload = { title, description, imageString };

    try {
      if (editingData) {
        // Update existing data
        const response = await axios.put('/api/updateData', { id: editingData.id, ...payload });
        if (response.status === 200) {
          setData(data.map(item => (item.id === editingData.id ? response.data.updatedData : item)));
          setEditingData(null);
          toast.success('Data updated successfully!');
        }
      } else {
        // Save new data
        const response = await axios.post('/api/saveData', payload);
        if (response.status === 200) {
          console.log('Data saved with ID:', response.data.dataId);
          toast.success('Data submitted successfully!');
        }
      }
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Error saving data!');
    }
  };

  const handleGetData = async () => {
    try {
      const response = await axios.get('/api/getData');
      if (response.status === 200) {
        setData(response.data);
        toast.success('Data retrieved successfully!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white p-10 shadow-xl rounded-lg"> {/* Increased max-width here */}
        <ToastContainer />
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Editor Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
                Description
              </label>
              <div className="mt-1">
                <ReactQuill
                  value={description}
                  onChange={setDescription}
                  className="w-full h-52 border border-gray-300 rounded-md shadow-sm"
                  style={{ height: '200px' }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-bold text-gray-700 mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="submit"
              className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editingData ? 'Update' : 'Submit'}
            </button>
            <button
              type="button"
              onClick={handleGetData}
              className="py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Get Data
            </button>
          </div>
        </form>

        {data.length > 0 && (
          <div className="mt-8">
            <DataTable data={data} setData={setData} setEditingData={setEditingData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorForm;