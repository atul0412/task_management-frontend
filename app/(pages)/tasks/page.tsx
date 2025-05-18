'use client';
import React, { useEffect, useState } from 'react'
import { FaEdit, FaFilter, FaRegUser } from 'react-icons/fa'
import Spinner from '@/app/components/Spinner';
import { MdAccessTime, MdOutlineCalendarMonth, MdArrowBackIos, MdArrowForwardIos, MdDelete } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from 'next/navigation';
import { createTask, deleteTask, getTasks, updateTask } from '@/app/Services/tasksService';
import AddTask from '@/app/components/AddTask';
import { getSecureJsonValueFromLocalStorage } from '@/app/Services/core.services';

const Tasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setIsLoading] = useState(false);
    const [isAddTaskVisible, setIsAddTaskVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingTask, setEditingTask] = useState<any>(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    useEffect(() => {
        fetchTasks();
    }, []);

    const user = getSecureJsonValueFromLocalStorage('user') ?? '';

    const fetchTasks = async () => {
        try {
            const response = await getTasks(user.id);
            setTasks(response);
            setIsLoading(false)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const filteredTasks = tasks.filter((task) => {
        const matchesCategory = filterCategory ? task.category.name === filterCategory : true;
        const matchesStatus = filterStatus ? task.status === filterStatus : true;
        return matchesCategory && matchesStatus;
    });

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'in_progress':
                return 'bg-yellow-400 text-black';
            case 'pending':
                return 'bg-red-600 text-white';
            case 'completed':
                return 'bg-green-500 text-white';
            default:
                return '';
        }
    }

    const toggleAddTask = () => {
        setSuccessMessage('')
        setIsAddTaskVisible(!isAddTaskVisible);
        setEditingTask(null);
    };

    const handleTaskSubmit = async (taskData: any) => {
        setIsLoading(true);
        setSuccessMessage('');
        try {
            if (editingTask) {
                await updateTask(editingTask.id, taskData);
                setSuccessMessage('Task updated successfully!');
            } else {
                await createTask(taskData);
                setSuccessMessage('Task created successfully!');
            }
            setIsLoading(false);
            fetchTasks();
        } catch (error) {
            console.error(error);
            setSuccessMessage('Failed to create task. Please try again.');
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(tasks.length / tasksPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleEdit = (taskId: string) => {
        const taskToEdit = tasks.find(task => task.id === taskId);
        setEditingTask(taskToEdit);
        setIsAddTaskVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            alert('Are you sure want to delete task');
            await deleteTask(id);
            setTasks(tasks.filter((task: any) => task.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <div className={`${isAddTaskVisible ? 'blur-sm' : ''}`}>
                <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4 border border-gray-300 border-solid p-2 sm:p-4">Task</h1>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 sm:gap-0'>
                    <h2 className="text-lg sm:text-xl font-semibold text-blue-600">Task List</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={toggleAddTask}>Add Task</button>
                        <button className="px-3 py-2 text-lg"><FaFilter /></button>
                        <button className="px-3 py-2 text-xl"><BsThreeDots /></button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:gap-10 mb-4">
                    <div>
                        <label htmlFor="categoryFilter" className="mr-2">Category:</label>
                        <select
                            id="categoryFilter"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full md:w-auto"
                        >
                            <option value="">All Categories</option>
                            {tasks.map((task) => (
                                <option key={task.category.name} value={task.category.name}>
                                    {task.category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="statusFilter" className="mr-2">Status:</label>
                        <select
                            id="statusFilter"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border border-gray-300 p-2 rounded w-full md:w-auto"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-[600px] w-full bg-white border border-gray-300 text-xs sm:text-sm">
                        <thead className='border border-gray-300'>
                            <tr>
                                <th className="px-2 sm:px-4 py-2 border text-center">ID</th>
                                <th className="px-2 sm:px-4 py-2 border text-center">Task Name</th>
                                <th className="px-2 sm:px-4 py-2 border text-center">
                                    <div className="flex items-center justify-center">
                                        <FaRegUser className='mr-1' /> Assigned To
                                    </div>
                                </th>
                                <th className="px-2 sm:px-4 py-2 border text-center">
                                    <div className="flex items-center justify-center">
                                        <IoHomeOutline className='mr-1' /> Category
                                    </div>
                                </th>
                                <th className="px-2 sm:px-4 py-2 border text-center">Status</th>
                                <th className="px-2 sm:px-4 py-2 border text-center">
                                    <div className="flex items-center justify-center">
                                        <MdOutlineCalendarMonth className='mr-1' /> Task Date
                                    </div>
                                </th>
                                <th className="px-2 sm:px-4 py-2 border text-center">
                                    <div className="flex items-center justify-center">
                                        <MdAccessTime className='mr-1' /> Due Date
                                    </div>
                                </th>
                                <th className="px-1 sm:px-2 py-2 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center text-gray-500 text-base py-4">
                                        No tasks available
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {currentTasks.map((task: any, index: number) => (
                                        <tr key={index}>
                                            <td className="px-2 sm:px-4 py-2 border text-center"></td>
                                            <td className="px-2 sm:px-4 py-2 border text-center ">
                                                <div className='flex items-center justify-between group'>
                                                    <span>{task.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-2 sm:px-4 py-2 border text-center">
                                                {task.user.first_name} {task.user.last_name}
                                            </td>
                                            <td className="px-2 sm:px-4 py-2 border text-center">
                                                {task.category.name}
                                            </td>
                                            <td className={`px-2 sm:px-4 py-2 border text-center ${getStatusClass(task.status)}`}>
                                                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                            </td>
                                            <td className="px-2 sm:px-4 py-2 border text-center">{new Date(task.task_date).toLocaleDateString()}</td>
                                            <td className="px-2 sm:px-4 py-2 border text-center">{new Date(task.dueDate).toLocaleDateString()}</td>
                                            <td className='px-1 sm:px-2 py-2 border text-center '>
                                                <div className='flex flex-col sm:flex-row justify-center gap-2 sm:gap-4'>
                                                    <FaEdit className='text-blue-600 hover:text-blue-800 cursor-pointer' onClick={() => handleEdit(task.id)} />
                                                    <MdDelete className='text-red-600 hover:text-red-800 cursor-pointer' onClick={() => handleDelete(task.id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row justify-center items-center mt-4 gap-2">
                    <button
                        className="bg-gray-500 text-white p-2 rounded"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <MdArrowBackIos />
                    </button>
                    <span className='px-2'>Page {currentPage} of {Math.ceil(tasks.length / tasksPerPage)}</span>
                    <button
                        className="bg-gray-500 text-white p-2 rounded"
                        onClick={handleNextPage}
                        disabled={currentPage === Math.ceil(tasks.length / tasksPerPage)}
                    >
                        <MdArrowForwardIos />
                    </button>
                </div>
            </div>
            {isAddTaskVisible && (
                <AddTask onClose={toggleAddTask} onSubmit={handleTaskSubmit} isLoading={loading}
                    successMessage={successMessage} editTask={editingTask} />
            )}
        </div>
    )
}

export default Tasks
