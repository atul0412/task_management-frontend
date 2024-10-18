"use client";
import Spinner from '@/app/components/Spinner';
import { getSecureJsonValueFromLocalStorage, getUid } from '@/app/Services/core.services';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

const Categories = () => {
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState<any>({
        id: '',
        name: '',
        userId: ''
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const user = getSecureJsonValueFromLocalStorage('user') ?? '';

    useEffect(() => {
        fetchCategories()
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/user/${user.id}`);
            setCategories(response.data.success.body.data);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }

    const handleEdit = (selectedCategory: any) => {
        setCategory({
            id: selectedCategory.id,
            name: selectedCategory.name,
            userId: selectedCategory.userId
        });
        setIsEditing(true); // Set edit mode   
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${id}`);
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputChange = (e: any) => {
        setCategory((prevTask: any) => ({ ...prevTask, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                // Update existing category
                await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories/${category.id}`, {
                    name: category.name,
                    userId: category.userId ?? user.id,
                });
            } else {
                // Add new category
                await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, {
                    id: getUid(),
                    name: category.name,
                    userId: user.id,
                });
            }
            setLoading(false);
            setCategory({ id: '', name: '', userId: '' });
            setIsEditing(false); // Reset edit mode
            fetchCategories(); // Refresh category list
        } catch (error) {
            console.log(error);
        }
    }

    if (loading) {
        <Spinner />
    }

    return (
        <div className="m-4">
            <div className="bg-black text-white p-4">
                <h1 className="text-xl">Categories</h1>
            </div>
            <div className="bg-white p-6 shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Add Categories
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="category"
                            type="text"
                            name="name"
                            value={category.name}
                            placeholder="Enter category name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex items-center justify-start">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Add Categories
                        </button>
                    </div>
                </form>
            </div>
            <div className="mt-6">
                {categories.map((category: any) => (
                    <div className="bg-white p-4 shadow-md flex items-center justify-between my-2">
                        <div className="flex items-center">
                            <span>{category.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <FaEdit
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                onClick={() => handleEdit(category)}
                            />
                            <MdDelete
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                onClick={() => handleDelete(category.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories