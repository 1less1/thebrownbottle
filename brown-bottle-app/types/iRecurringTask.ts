export interface RecurringTask {
    title: string;
    description: string;
    author_id: number;
    section_id: number;
    mon: number; // 1=True, 0=False
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
    start_date: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD (optional)
}

export interface GetRecurringTask {
    recurring_task_id: number;
    author_id: number;
    section_id: number;
    mon: number; // 1=True, 0=False
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
    start_date: string; // YYYY-MM-DD
    end_date: string; // YYYY-MM-DD
}

export interface InsertRecurringTask {
    title: string;
    description: string;
    author_id: number;
    section_id: number;
    mon: number; // 1=True, 0=False
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
    start_date: string; // YYYY-MM-DD
    end_date?: string; // YYYY-MM-DD (optional)
}

export interface UpdateRecurringTask {
    title: string;
    description: string;
    author_id: number;
    section_id: number;
    mon: number; // 1=True, 0=False
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
    start_date: string; // YYYY-MM-DD
    end_date: string; // YYYY-MM-DD
}