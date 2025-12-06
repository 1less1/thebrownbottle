import Constants from "expo-constants";

// POST Request that inserts an Announcement record in the Database - **Works**
export async function insertAnnouncement(
  author_id: number,
  title: string,
  description: string,
  role_id: number
) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  try {
    const announcementData = {
      author_id,
      title,
      description,
      role_id,
    };

    const response = await fetch(`${baseURL}/announcement/insert`, {
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

    return data;
  } catch (error) {
    console.error("Failed to insert announcement:", error);
    throw error;
  }
}

// GET Request that fetches Announcements made by a particular user (author_id)
export async function getUserAnnouncements(author_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(
      `${baseURL}/announcement?employee_id=${author_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch user announcements:", error);
    throw error;
  }
}

// GET Request that fetches ALL Announcements made in the last 14 days! - **Works**
export async function getAllAnnouncements() {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(`${baseURL}/announcement`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch ALL announcements:", error);
    throw error;
  }
}

export async function acknowledgeAnnouncement(
  announcement_id: number,
  employee_id: number
) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  const response = await fetch(`${baseURL}/announcement/acknowledge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ announcement_id, employee_id }),
  });

  if (!response.ok) {
    throw new Error("Failed to acknowledge announcement");
  }

  return response.json();
}

// GET Acknolwedged Announcements for a specific employee
export async function getAcknowledgedAnnouncements(employee_id: number) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  const response = await fetch(
    `${baseURL}/announcement/acknowledged?employee_id=${employee_id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch acknowledged announcements");
  }

  return (await response.json()) as { announcement_id: number }[];
  // [{ announcement_id, employee_id, acknowledged_at, employee_name }]
}

// GET Request that fetches Announcements targeted for a specific role (role_id)  - **Works**
export async function getAnnouncementsByRole(role_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(`${baseURL}/announcement?role_id=${role_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to fetch user announcements:", error);
    throw error;
  }
}
