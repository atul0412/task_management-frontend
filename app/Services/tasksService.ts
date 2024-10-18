import axios from "axios";
import axiosInstance from "./axiosInterceptor";



// Get all tasks
export const getTasks = async (id:string) => {
  try {
    const response = await axiosInstance.get(`/tasks/user/${id}`);
    console.log(response, "response");
    return response.data.success.body.data; // Return tasks array
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData: any) => {
  try {
    const response = await axiosInstance.post(`/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (id: string, taskData: any) => {
  try {
    const response = await axiosInstance.put(`/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Function to fetch employee by ID
export const getTaskById = async (taskId: string) => {
  try {
    const response = await axiosInstance.get(`/tasks/${taskId}`);
    return response.data.success.body.data; // Assuming the response contains 'userData'
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


// Delete a task
export const deleteTask = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

