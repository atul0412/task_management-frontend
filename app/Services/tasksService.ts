import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:7000/api";

// Get all tasks
export const getTasks = async (id:string) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/user/${id}`);
    console.log(response, "response");
    return response.data.success.body.data; // Return tasks array
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};

export const createTask = async (taskData: any) => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (id: string, taskData: any) => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// Function to fetch employee by ID
export const getTaskById = async (taskId: string) => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${taskId}`);
    return response.data.success.body.data; // Assuming the response contains 'userData'
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


// Delete a task
export const deleteTask = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const getAvailableUsers = async() =>{
  try {
    const resposne = await axios.post(`${API_URL}/tasks/available-users`);
    return resposne.data.data;
  } catch (error) {
    console.error(error)
  }
}
