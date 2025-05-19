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


// Inserts recurring task(s) into the database with a POST Request - **Works**
// Loops through all selected recurrence_days and sends a separate request 
// for each day with the exact same parameters. 
// Ex: "Saturday and Sunday" --> Two Separate requests are made with the only 
// difference being the recurrence_day attribute!
export async function insertRecurringTask(author_id: number, title: string, description: string, 
  section_id: number, recurrence_days: string[], start_date: string, end_date: string | null) {
  
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  if (!recurrence_days || recurrence_days.length < 1) {
    throw new Error("Recurrence Days must include at least one day!");
  }

  const results = [];

  try {
    // Sends the separate post requests in sequential order
    // The next requests waits until a response is given for the previous request
    for (const recurrence_day of recurrence_days) {
      let taskData: Record<string, any> = {
        title,
        description,
        author_id,    
        section_id,
        recurrence_day,
        start_date,
      };

      if (end_date) {
        taskData.end_date = end_date;
      }

      const response = await fetch(`${baseURL}/task/new-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} on day ${recurrence_day}`);
      }

      const data = await response.json();
      results.push(data);
    }

    return results; // array of responses for each day, in order
  } catch (error) {
    console.error("Failed to insert recurring tasks:", error);
    throw error;
  }
}
