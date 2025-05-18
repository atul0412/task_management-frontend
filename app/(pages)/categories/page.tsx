"use client";
import Spinner from '@/app/components/Spinner';
import axiosInstance from '@/app/Services/axiosInterceptor';
import { getSecureJsonValueFromLocalStorage, getUid } from '@/app/Services/core.services';
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
            const response = await axiosInstance.get(`/categories/user/${user.id}`);
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
            await axiosInstance.delete(`/categories/${id}`);
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
                await axiosInstance.put(`/categories/${category.id}`, {
                    name: category.name,
                    userId: category.userId ?? user.id,
                });
            } else {
                // Add new category
                await axiosInstance.post(`/categories`, {
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
        return <Spinner />
    }

    return (
        <div className="m-2 md:m-4 max-w-screen-md mx-auto">
            <div className="bg-black text-white p-2 md:p-4 rounded-t">
                <h1 className="text-lg md:text-xl">Categories</h1>
            </div>
            <div className="bg-white p-4 md:p-6 shadow-md rounded-b">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            {isEditing ? "Edit Category" : "Add Category"}
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
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
                            type="submit"
                        >
                            {isEditing ? "Update Category" : "Add Category"}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full sm:w-auto"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCategory({ id: '', name: '', userId: '' });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <div className="mt-4 md:mt-6">
                {categories.map((category: any) => (
                    <div
                        key={category.id}
                        className="bg-white p-3 md:p-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between my-2 rounded"
                    >
                        <div className="flex-1 mb-2 sm:mb-0">
                            <span className="text-base md:text-lg">{category.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaEdit
                                className="text-blue-600 hover:text-blue-800 cursor-pointer text-lg"
                                onClick={() => handleEdit(category)}
                            />
                            <MdDelete
                                className="text-red-600 hover:text-red-800 cursor-pointer text-lg"
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