export interface Announcement {
  announcement_id: number;
  author_id: number;
  author: string;
  role_id: number;
  role_name: string;
  title: string;
  description: string;
  timestamp: string;
  acknowledged?: number; // 1 = Yes, 0 = No
}

export interface GetAnnouncement {
  announcement_id: number;
  author_id: number; // employee_id of the author
  role_id: number;
  title: string;
  // Filters only the last 14 days worth of announcements
  recent_only: number; // 1=True, 0=False
  timestamp_sort: "Newest" | "Oldest";
}

export interface InsertAnnouncement {
  author_id: number;
  title: string;
  description: string;
  role_id: number;
}

export interface UpdateAnnouncement {
  author_id: number; // This should only be updated if we are letting people edit announcement after submission
  title: string;
  description: string;
  role_id: number;
}



export interface Acknowledgement {
  announcement_id: number // Foreign Key
  employee_id: number;
  employee_name: number;
  acknowledged_at: string; // YYYY-MM-DD 00:00 (24 hour time)
}

// POST Route
export interface AcknowledgeAnnouncement {
  announcement_id: number;
  employee_id: number;
}

// GET Route
export interface GetAcknowledgedAnnouncements {
  announcement_id: number;
  employee_id: number;
  // Filters only the last 14 days worth of announcements (their acknowledgements!)
  recent_only: number; // 1=True, 0=False
}