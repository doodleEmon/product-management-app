'use client'

import { baseUrl } from "@/constants";

export async function apiCall<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown,
    token?: string
): Promise<T> {

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const errorData = await res.json() as { message?: string };
        console.log('errorData.message', errorData.message)
        throw new Error(errorData.message || "API request failed");
    }

    return res.json() as Promise<T>;
}