import Constants from 'expo-constants';

export async function createShiftCoverRequest(shift_id: number, requested_employee_id: number){

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {

    const coverData = {
        shift_id,
        requested_employee_id,
    };

    const response = await fetch(`${baseURL}/shift-cover-request/create-shift-cover-cover-request`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coverData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
    console.log(data); // Log the response data (including task_id)
    return data; // This will be the JSON response from Flask, containing the task ID
  
  } catch (error) {
    console.error("Failed to insert shift cover request:", error);
    throw error; // Optional: Rethrow the error if you want to handle it elsewhere
  }

}

export async function getAllCoverRequests() {

    // Retrieve Environment Variables
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  
    const baseURL = API_BASE_URL;
  
    try {
      // Sending the assignee_id as a query parameter in the URL
      const response = await fetch(`${baseURL}/shift-cover-request/get-all-cover-requests`, {
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
      console.error("Failed to fetch all cover requests:", error);
      throw error;
    }
  
  }


// Gets cover requests for the user that made them "Your Cover Requests"
export async function getUserShiftCoverRequest(requested_employee_id: number) {

  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    // Sending the assignee_id as a query parameter in the URL
    const response = await fetch(`${baseURL}/shift-cover-request/get-user-shift-cover-request?employee_id=${requested_employee_id}`, {
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
    console.error("Failed to fetch user shift cover requests:", error);
    throw error;
  }

}

// Gets cover requests a user accepts "Your Accepted Cover Requests"
export async function getAcceptedShiftCoverRequest(accepted_employee_id: number) {

    // Retrieve Environment Variables
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  
    const baseURL = API_BASE_URL;
  
    try {
      // Sending the assignee_id as a query parameter in the URL
      const response = await fetch(`${baseURL}/shift/get-accepted-shift-cover-request?employee_id=${accepted_employee_id}`, {
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
      console.error("Failed to fetch accepted shift cover requests:", error);
      throw error;
    }
  
  }