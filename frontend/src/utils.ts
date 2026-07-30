export const Status = {
    Open: "open",
    InProgress: "in_progress",
    Completed: "completed",
} as const;

export type Status = typeof Status[keyof typeof Status];

export const Priority = {
    High: "high",
    Moderate: "moderate",
    Low: "low"
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export interface Task {
    id?: number;
    title: string;
    description: string;
    status: Status;
    due_date: string;
    priority: Priority;
}

export const StatusTitles = {
    [Status.Open]: "Open",
    [Status.InProgress]: "In Progress",
    [Status.Completed]: "Completed",
}

const BASE_URL = "http://127.0.0.1:8080/api"

export const fetchApi = async (url: string, method: string = 'GET', data?: any) => {
    const token = localStorage.getItem('token');

    return fetch(`${BASE_URL}/${url}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Accept': 'application/json',
        },
        ...(data && method !== "GET" ? { body: JSON.stringify(data) } : {})
    })
}