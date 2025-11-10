import Constants from "expo-constants";

export async function insertTimeOffRequest(
  employee_id: number,
  reason: string,
  start_date: string,
  end_date: string
) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const timeOffRequestData = {
      employee_id,
      reason,
      start_date,
      end_date,
    };

    const response = await fetch(`${baseURL}/tor/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(timeOffRequestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Failed to insert time off request:", error);
    throw error;
  }
}

export async function getTimeOffRequests(filters?: {
  employee_id?: number;
  status?: "Pending" | "Accepted" | "Denied";
  start_date?: string;
  end_date?: string;
}) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        params.append(key, String(value));
    });
  }

  const response = await fetch(`${API_BASE_URL}/tor?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
}

export const updateTimeOffStatus = async (
  request_id: number,
  status: string
) => {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  const response = await fetch(`${baseURL}/tor/update/${request_id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(
      `Failed to update time off request ${request_id}: ${errText}`
    );
  }

  return await response.json();
};
