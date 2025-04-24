import Constants from 'expo-constants';

export async function assignSection(section_id: number, section_name: string, employee_id: number){

    // Retrieve Environment Variables
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};

    const baseURL = API_BASE_URL;

    try {

        const sectionData = {
            section_id,
            section_name,
            employee_id
        };

        const response = await fetch(`${baseURL}/section/insert-section`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sectionData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log(data); // Log the response data (including task_id)
          return data; // This will be the JSON response from Flask, containing the task ID
      
        } catch (error) {
          console.error("Failed to insert section:", error);
          throw error; // Optional: Rethrow the error if you want to handle it elsewhere
        }



    }

    export async function getUserSection(employee_id: number) {

        // Retrieve Environment Variables
        const { API_BASE_URL } = Constants.expoConfig?.extra || {};
      
        const baseURL = API_BASE_URL;
      
        try {
          // Sending the assignee_id as a query parameter in the URL
          const response = await fetch(`${baseURL}/section/get-user-section?employee_id=${employee_id}`, {
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
          console.error("Failed to fetch user section:", error);
          throw error;
        }
      
      }   