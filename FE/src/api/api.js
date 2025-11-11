const BASE_URL = "http://localhost:5000";

const api = {
    async request(method, endpoint, data = null, token = null) {
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const config = {
            method,
            headers,
            credentials: "include",
        };

        if (data) config.body = JSON.stringify(data);

        const response = await fetch(`${BASE_URL}${endpoint}`, config);

        // parse JSON response; if fails, fall back to text
        let parsed;
        let text;
        try {
            parsed = await response.json();
        } catch (e) {
            try {
                text = await response.text();
            } catch (e2) {
                text = null;
            }
        }

        if (!response.ok) {
            const message = (parsed && parsed.message) || (parsed && parsed.error) || text || "Request failed";
            const err = new Error(message);
            err.status = response.status;
            err.body = parsed || text;
            throw err;
        }

        return parsed !== undefined ? parsed : text;
    },

    get(endpoint, token = null) {
        return this.request("GET", endpoint, null, token);
    },
    post(endpoint, data, token = null) {
        return this.request("POST", endpoint, data, token);
    },
    put(endpoint, data, token = null) {
        return this.request("PUT", endpoint, data, token);
    },
    patch(endpoint, data, token = null) {
        return this.request("PATCH", endpoint, data, token);
    },
    delete(endpoint, token = null) {
        return this.request("DELETE", endpoint, null, token);
    },
};

export default api;
