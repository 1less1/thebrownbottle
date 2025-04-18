// This file will send a request to the backend python api to insert and get task info 

// Inserts a task into the database
export async function insertTask(title: string, description: string, author_id: number, assignee_id: number, due_date: string) {
    try {
      // Data you want to send in the request body
      const taskData = {
        title,
        description,
        author_id,   
        assignee_id,      
        due_date,
        complete: 0 // Default to incomplete/false (0)
      };
  
      const response = await fetch("http://134.161.42.235:5000/tasks/insert", {
        method: "POST", // Using POST to send data
        headers: {
          "Content-Type": "application/json", // Ensure the backend understands the content type
        },
        body: JSON.stringify(taskData), // Send the task data in the request body as JSON
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); // Log the response data (including task_id)
      return data; // This will be the JSON response from Flask, containing the task ID
  
    } catch (error) {
      console.error("Failed to insert task:", error);
      throw error; // Optional: Rethrow the error if you want to handle it elsewhere
    }
  }
  

  export async function getTasks() {
    try {
      const response = await fetch("http://134.161.42.235:5000/tasks/get");
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data; // This will be your JSON response from Flask
    } catch (error) {
      console.error("Failed to fetch shifts:", error);
      throw error;
    }
  }