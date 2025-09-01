import { getCookie } from "./cookies";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function hasCookie(name) {
    return document.cookie.split(";").some(c => c.trim().startsWith(`${name}=`));
}

async function request(path, { method = "GET", body, headers = {}, retry = true } = {}) {
    const opts = {
        method,
        credentials: "include",
        headers: {
            ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...headers,
        },
        body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    };

    // Add CSRF header for ALL requests that might need it
    const accessCsrf = getCookie("csrf_access_token");
    const refreshCsrf = getCookie("csrf_refresh_token");
    const csrf = accessCsrf || refreshCsrf;
    
    if (csrf) {
        opts.headers["X-CSRF-TOKEN"] = csrf;
    }

    // Debug logging
    console.log('Request details:', {
        url: `${BASE}${path}`,
        method: opts.method,
        headers: opts.headers,
        bodyType: typeof opts.body,
        bodyContent: opts.body,
        cookies: document.cookie
    });

    const res = await fetch(`${BASE}${path}`, opts);

    // Log response details
    console.log('Response details:', {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries())
    });

    // Only try refresh if we actually HAVE a refresh cookie
    if (res.status === 401 && retry && hasCookie("csrf_refresh_token")) {
        console.log('Attempting token refresh...');
        const refreshCsrf = getCookie("csrf_refresh_token");
        if (refreshCsrf) {
            const refreshed = await fetch(`${BASE}/api/auth/refresh`, {
                method: "POST",
                credentials: "include",
                headers: { "X-CSRF-TOKEN": refreshCsrf },
            });
            if (refreshed.ok) {
                console.log('Token refresh successful, retrying original request');
                return request(path, { method, body, headers, retry: false });
            } else {
                console.log('Token refresh failed:', refreshed.status);
            }
        }
    }

    if (!res.ok) {
        let err;
        try { 
            const contentType = res.headers.get("content-type");
            const responseText = await res.text();
            console.log('Error response text:', responseText);
            
            if (contentType && contentType.includes("application/json") && responseText) {
                err = JSON.parse(responseText);
            } else {
                err = { error: responseText || res.statusText };
            }
        } catch (parseError) { 
            console.log('Error parsing response:', parseError);
            err = { error: res.statusText }; 
        }
        console.log('Throwing error:', err);
        throw Object.assign(new Error(err.error || res.statusText), { 
            status: res.status, 
            data: err 
        });
    }
    
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

export const api = {
    // auth
    register: (email, password) => request("/api/auth/register", { method: "POST", body: { email, password } }),
    login: (email, password) => request("/api/auth/login", { method: "POST", body: { email, password } }),
    logout: () => request("/api/auth/logout", { method: "POST" }),
    me: () => request("/api/auth/me"),

    // trips
    listTrips: () => request("/api/trips"),
    createTrip: (payload) => request("/api/trips", { method: "POST", body: payload }),
    getTrip: (id) => request(`/api/trips/${id}`),
    updateTrip: (id, payload) => request(`/api/trips/${id}`, { method: "PATCH", body: payload }),
    deleteTrip: (id) => request(`/api/trips/${id}`, { method: "DELETE" }),

    // entries
    listEntries: (tripId) => request(`/api/trips/${tripId}/entries`),
    createEntry: (tripId, payload) => request(`/api/trips/${tripId}/entries`, { method: "POST", body: payload }),
    updateEntry: (id, payload) => request(`/api/entries/${id}`, { method: "PATCH", body: payload }),
    deleteEntry: (id) => request(`/api/entries/${id}`, { method: "DELETE" }),

    // photos
    signUpload: (tripId) => request(`/api/uploads/sign?trip_id=${tripId}`, { method: "POST" }),
    listPhotos: (tripId) => request(`/api/trips/${tripId}/photos`),
    savePhoto: (tripId, payload) => request(`/api/trips/${tripId}/photos`, { method: "POST", body: payload }),
    deletePhoto: (id) => request(`/api/photos/${id}`, { method: "DELETE" }),
};