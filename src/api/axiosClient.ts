import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refreshToken = useAuthStore.getState().refreshToken;
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    { refreshToken }
                )
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                useAuthStore.getState().updateTokens(accessToken, newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            }catch{
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;