// This file will send a request to the backend python api which will fetch shift info 

export async function getShifts() {
    try {
      const response = await fetch("http://192.168.1.244:5000/shifts");
  
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

  export async function getTables() {
    try {
      const response = await fetch("http://192.168.1.244:5000/tables");
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data; // This will be your JSON response from Flask
    } catch (error) {
      console.error("Failed to fetch tables:", error);
      throw error;
    }
  }
  
