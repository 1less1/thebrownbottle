import Constants from "expo-constants";
import { UpdateTaskFields } from "@/types/iApi";

// POST Request that INSERTS a task into the database - **Works**
export async function insertTask(
  author_id: number,
  title: string,
  description: string,
  section_id: number,
  due_date: string
) {
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

    const response = await fetch(`${baseURL}/task/insert`, {
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

// POST Request that INSERTS recurring task(s) into the database - **Works**
// Loops through all selected recurrence_days and sends a separate request
// for each day with the exact same parameters.
// Ex: "Saturday and Sunday" --> Two Separate requests are made with the only
// difference being the recurrence_day attribute!
export async function insertRecurringTask(
  author_id: number,
  title: string,
  description: string,
  section_id: number,
  recurrence_days: string[],
  start_date: string,
  end_date: string | null
) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  if (!recurrence_days || recurrence_days.length < 1) {
    throw new Error("Recurrence Days must include at least one day!");
  }

  // Initialize all weekdays to 0 (false)
  type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

  const allDays: Record<Weekday, number> = {
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  };

  recurrence_days.forEach((day) => {
    const d = day.toLowerCase() as Weekday;
    if (d in allDays) {
      allDays[d] = 1;
    }
  });

  // Build the final task object
  const taskData: Record<string, any> = {
    title,
    description,
    author_id,
    section_id,
    start_date,
    ...allDays, // 👈 This spreads the weekday flags (e.g. mon: 1, tue: 0, etc.)
  };

  if (end_date) {
    taskData.end_date = end_date;
  }

  try {
    const response = await fetch(`${baseURL}/recurring-task/insert`, {
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
    console.error("Failed to insert recurring task:", error);
    throw error;
  }
}

// Flexible GET Request for task - **Works**
export async function getTasks(options: {
  section_id?: number;
  complete?: 0 | 1;
  today?: boolean;
  recurring?: boolean;
  due_date?: string;
}) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  const params = new URLSearchParams();

  if (options.section_id !== undefined)
    params.append("section_id", options.section_id.toString());
  if (options.complete !== undefined)
    params.append("complete", options.complete.toString());
  if (options.today !== undefined)
    params.append("today", options.today.toString());
  if (options.recurring !== undefined)
    params.append("recurring", options.recurring.toString());
  if (options.due_date !== undefined)
    params.append("due_date", options.due_date.toString());

  try {
    const response = await fetch(`${baseURL}/task?${params.toString()}`, {
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
    console.error("Failed to fetch tasks:", error);
    throw error;
  }
}

// Flexible PATCH (Update) Request for task
export async function updateTask(task_id: number, updates: UpdateTaskFields) {
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};
  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(`${baseURL}/task/update/${task_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to update task: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    return data; // The backend success message JSON
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// GET Request that fetches today's COMPLETE tasks filtered by section_id
export async function getTodayTasksComplete(section_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(
      `${baseURL}/task/today-complete?section_id=${section_id}`,
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

// GET Request that fetches today's INCOMPLETE tasks filtered by section_id
export async function getTodayTasksIncomplete(section_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(
      `${baseURL}/task/today-incomplete?section_id=${section_id}`,
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

// GET Request that fetches ALL COMPLETE tasks filtered by section_id
export async function getAllTasksComplete(section_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(
      `${baseURL}/task/all-complete?section_id=${section_id}`,
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

// GET Request that fetches ALL INCOMPLETE tasks filtered by section_id
export async function getAllTasksIncomplete(section_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(
      `${baseURL}/task/all-incomplete?section_id=${section_id}`,
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

// GET Request that fetches nonrecurring tasks filtered by section_id
export async function getTasksBySection(section_id: number) {
  // Retrieve Environment Variables
  const { API_BASE_URL } = Constants.expoConfig?.extra || {};

  const baseURL = API_BASE_URL;

  try {
    const response = await fetch(
      `${baseURL}/task/tasks-by-section?section_id=${section_id}`,
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
