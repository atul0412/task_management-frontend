import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { MdAccessTime, MdOutlineCalendarMonth } from 'react-icons/md';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSecureJsonValueFromLocalStorage, getUid } from '@/app/Services/core.services';
import axios from 'axios';
import axiosInstance from '@/app/Services/axiosInterceptor';

const AddTask = ({ onClose, onSubmit, isLoading, successMessage, editTask }: any) => {
    const [loading, setLoading] = useState(false);
    const [task, setTask] = useState<any>({
        userId: "",
        task_date: "",
        description: "",
        category_id: "",
        status: "",
        title: "",
        dueDate: ""
    });
    const [categories, setCategories] = useState<any[]>([]);


    useEffect(() => {
        fetchCategories();
    }, []);

    const user = getSecureJsonValueFromLocalStorage('user') ?? '';

    const fetchCategories = async() => {
        try {
            const response = await axiosInstance.get(`/categories/user/${user.id}`);
            setCategories(response.data.success.body.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (editTask) {
            // Prefill the form with task data if editing
            setTask({
                id: editTask.id,
                title: editTask.title || '',
                userId: editTask.userId,
                description: editTask.description || '',
                category_id: editTask.category_id || '',
                status: editTask.status || '',
                task_date: editTask.task_date || '',
                dueDate: editTask.dueDate || '',
            });
        }
    }, [editTask]);


    const handleInputChange = (e: any) => {

        setTask((prevTask: any) => ({ ...prevTask, [e.target.name]: e.target.value }));
    };

    const handleDateChange = (date: Date | null, field: string) => {
        setTask((prevTask: any) => ({ ...prevTask, [field]: date }));
    };


    const handleSubmit = (e: any) => {
        e.preventDefault();

        const taskData = {
            id: task.id ?? getUid(),
            title: task.title,
            description: task.description,
            task_date: task.task_date,
            userId: user.id,
            category_id: task.category_id,
            status: task.status,
            dueDate: task.dueDate,
        };
        onSubmit(taskData)
    };

    console.log('task', task)

    return (
        <div className=" fixed top-0 right-0 w-2/4 h-full mx-auto bg-white p-8 shadow-md rounded">
            <div className="bg-blue-500 text-white text-lg font-semibold p-4 rounded-t">
                {editTask ? 'Edit Task' : 'New Task'}
            </div>
            {successMessage && (
                <div className="mt-4 text-green-500">
                    {successMessage}
                </div>
            )}
            <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Task Name <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 p-2 rounded" name="title" value={task.title} onChange={handleInputChange} required />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Task Description <span className="text-red-500">*</span></label>
                    <textarea className="w-full border border-gray-300 p-2 rounded" rows={3} name="description" value={task.description} onChange={handleInputChange}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Task Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <DatePicker
                                selected={task.task_date ? new Date(task.task_date) : null}
                                onChange={(date) => handleDateChange(date, "task_date")}
                                minDate={new Date()}
                                dateFormat="MMMM d, yyyy"
                                placeholderText="Select Date"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center px-2">
                                <MdOutlineCalendarMonth />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Due Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <DatePicker
                                selected={task.dueDate ? new Date(task.dueDate) : null}
                                onChange={(date) => handleDateChange(date, "dueDate")}
                                minDate={new Date()}
                                dateFormat="MMMM d, yyyy"
                                placeholderText="Select Date"
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center px-2">
                                <MdOutlineCalendarMonth />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                        <label className="block text-gray-700 font-medium mb-2">Category <span className="text-red-500">*</span></label>
                        <select className="w-full border border-gray-300 p-2 rounded" name="category_id"
                            value={task.category_id} onChange={handleInputChange} required>
                                <option value="" disabled>Select User</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}

                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Status <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select className="w-full border border-gray-300 p-2 rounded" name="status"
                                value={task.status} onChange={handleInputChange}>
                                <option value="" disabled>Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Complete</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                <i className="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-4">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded"> {editTask ? 'Update' : 'Add'}</button>
                    <button type="button" className="border border-blue-500 text-blue-500 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
                </div>
            </form>

        </div>
    )
}

export default AddTask