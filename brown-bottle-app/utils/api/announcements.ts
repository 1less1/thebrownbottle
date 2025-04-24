

import Constants from "expo-constants";

export async function insertAnnouncement(employee_id: number, title: string, description: string) {

    // Retrieve Environment Variables
    const { API_BASE_URL } = Constants.expoConfig?.extra || {};

    const baseURL = API_BASE_URL;

    try {
        const announcementData = {
            employee_id,
            title,
            description,
        };

        const response = await fetch(`${baseURL}/announcements/insert-announcement`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(announcementData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // Log the response data (including announcement_id)
        return data; // This will be the JSON response from Flask, containing the announcement ID
    }

    catch (error) {
        console.error("Failed to insert announcement:", error);
        throw error; // Optional: Rethrow the error if you want to handle it elsewhere
    }

}

