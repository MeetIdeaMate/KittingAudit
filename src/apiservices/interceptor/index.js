import axios from "axios";
const apiServices = axios.create();

// Request interceptor
apiServices.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("_ac");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return error;
    }
);

// Response interceptor
apiServices.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return error;
    }
);

export {
    apiServices,
};
