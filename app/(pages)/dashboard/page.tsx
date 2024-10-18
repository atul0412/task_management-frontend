'use client';
import React, { useEffect, useState } from 'react'
import withAuth from '../withAuth';
import { BsBuildings } from 'react-icons/bs';
import { FaClipboardList, FaClipboardCheck, FaClipboard } from 'react-icons/fa';
import Spinner from '@/app/components/Spinner';
import axios from 'axios';
import { getSecureJsonValueFromLocalStorage } from '@/app/Services/core.services';
import { set } from 'react-datepicker/dist/date_utils';
import axiosInstance from '@/app/Services/axiosInterceptor';

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
      const response = await axiosInstance.get(`/tasks/user/${user.id}`) // Fetch tasks from service
      const taskData  = response.data.success.body.data
      setTasks(taskData)
      // Filter tasks by status
      const inProgressTasks = taskData.filter((task:any) => task.status === 'in_progress');
      const pendingTasks = taskData.filter((task:any) => task.status === 'pending');
      const completedTasks = taskData.filter((task:any) => task.status === 'completed');

      // You can now set these categories to state or handle them accordingly
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
      const response = await axiosInstance.get(`/categories/user/${user.id}`) // Fetch categories from service
      const categoryData  = response.data.success.body.data
      // You can now set these categories to state or handle them accordingly
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
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-600">Dashboard</h1>
      <p className="text-xl mt-2">Welcome, {user?.first_name}</p>
      <div className="grid grid-cols-5 gap-4 mt-6">
        <div className="bg-yellow-400 p-6 rounded-sm flex items-center justify-between">
          <div className="text-lg font-semibold">{tasks.length} Tasks</div>
          <FaClipboardList className="text-2xl" />
        </div>
        <div className="bg-green-400 p-6 rounded-sm flex items-center justify-between">
          <div className="text-lg font-semibold">{tasksByStatus.completed.length} Task Completed</div>
          <FaClipboardCheck className="text-2xl" />
        </div>
        <div className="bg-blue-400 p-6 rounded-sm flex items-center justify-between">
          <div className="text-lg font-semibold">{tasksByStatus.inProgress.length} On Hold Tasks</div>
          <FaClipboard className="text-2xl" />
        </div>
        <div className="bg-red-400 p-6 rounded-sm flex items-center justify-between">
          <div className="text-lg font-semibold">{tasksByStatus.pending.length} Pending Tasks</div>
          <FaClipboard className="text-2xl" />
        </div>
        <div className="bg-red-400 p-6 rounded-sm flex items-center justify-between">
          <div className="text-lg font-semibold">{categories.length} Categories</div>
          <BsBuildings className="text-2xl" />
        </div>
      </div>
      
    </div>
  </div>
  )
}

export default Dashboard;