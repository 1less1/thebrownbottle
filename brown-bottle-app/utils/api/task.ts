// This file will send a request to the backend python api to insert and get task info 

import Constants from 'expo-constants';

// Inserts a task into the database with a POST Request - **Works**
export async function insertTask(author_id: number, title: string, description: string, 
  section_id: number, due_date: string) {
  
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const taskData = {
      title,
      description,
      author_id,   
      section_id,      
      due_date,
    };

    const response = await fetch(`${baseURL}/task/new-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;

  } catch (error) {
    console.error("Failed to insert task:", error);
    throw error;
  }

}


// Inserts a recurring task into the database with a POST Request
export async function insertrecurringask(author_id: number, title: string, description: string, 
  section_id: number, recurrence_day: string, start_date: string, end_date: string) {
  
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const taskData = {
      title,
      description,
      author_id,   
      section_id,      
      recurrence_day,
      start_date,
      end_date
    };

    const response = await fetch(`${baseURL}/task/new-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    return data;

  } catch (error) {
    console.error("Failed to insert task:", error);
    throw error;
  }

}
  

// Gets a particular section's tasks with a GET Request 
export async function getSectionTasks(section_id: number) {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    // Sending the section_id as a query parameter in the URL
    const response = await fetch(`${baseURL}/task/get-user-tasks?section_id=${section_id}`, {
      method: "GET", // GET is appropriate for fetching data
      headers: {
        "Content-Type": "application/json", // Ensure the backend understands the content type
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    return data; // This will be the JSON response from Flask, containing the task ID

  } catch (error) {
    console.error("Failed to fetch user tasks:", error);
    throw error;
  }

}
