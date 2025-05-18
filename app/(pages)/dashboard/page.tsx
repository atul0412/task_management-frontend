'use client';
import React, { useEffect, useState } from 'react'
import withAuth from '../withAuth';
import { BsBuildings } from 'react-icons/bs';
import { FaClipboardList, FaClipboardCheck, FaClipboard } from 'react-icons/fa';
import Spinner from '@/app/components/Spinner';
import axiosInstance from '@/app/Services/axiosInterceptor';
import { getSecureJsonValueFromLocalStorage } from '@/app/Services/core.services';

const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksByStatus, setTasksByStatus] = useState({
    inProgress: [],
    pending: [],
    completed: []
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const user: any = getSecureJsonValueFromLocalStorage('user') ?? '';

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/tasks/user/${user.id}`)
      const taskData  = response.data.success.body.data
      setTasks(taskData)
      const inProgressTasks = taskData.filter((task:any) => task.status === 'in_progress');
      const pendingTasks = taskData.filter((task:any) => task.status === 'pending');
      const completedTasks = taskData.filter((task:any) => task.status === 'completed');
      setTasksByStatus({
        inProgress: inProgressTasks,
        pending: pendingTasks,
        completed: completedTasks,
      });
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCategories = async() =>{
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/categories/user/${user.id}`)
      const categoryData  = response.data.success.body.data
      setCategories(categoryData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner /> 
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Dashboard</h1>
        <p className="text-lg sm:text-xl mt-2">Welcome, {user?.first_name}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mt-6">
          <div className="bg-yellow-400 p-4 sm:p-6 rounded-sm flex items-center justify-between">
            <div className="text-base sm:text-lg font-semibold">{tasks.length} Tasks</div>
            <FaClipboardList className="text-xl sm:text-2xl" />
          </div>
          <div className="bg-green-400 p-4 sm:p-6 rounded-sm flex items-center justify-between">
            <div className="text-base sm:text-lg font-semibold">{tasksByStatus.completed.length} Task Completed</div>
            <FaClipboardCheck className="text-xl sm:text-2xl" />
          </div>
          <div className="bg-blue-400 p-4 sm:p-6 rounded-sm flex items-center justify-between">
            <div className="text-base sm:text-lg font-semibold">{tasksByStatus.inProgress.length} On Hold Tasks</div>
            <FaClipboard className="text-xl sm:text-2xl" />
          </div>
          <div className="bg-red-400 p-4 sm:p-6 rounded-sm flex items-center justify-between">
            <div className="text-base sm:text-lg font-semibold">{tasksByStatus.pending.length} Pending Tasks</div>
            <FaClipboard className="text-xl sm:text-2xl" />
          </div>
          <div className="bg-red-400 p-4 sm:p-6 rounded-sm flex items-center justify-between">
            <div className="text-base sm:text-lg font-semibold">{categories.length} Categories</div>
            <BsBuildings className="text-xl sm:text-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
