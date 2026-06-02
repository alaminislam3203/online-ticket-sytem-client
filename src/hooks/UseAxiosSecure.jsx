import axios from 'axios';
import { useRef } from 'react';

const UseAxiosSecure = () => {
  const instanceRef = useRef(null);

  if (!instanceRef.current) {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    instance.interceptors.request.use(config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    });

    instanceRef.current = instance;
  }

  return instanceRef.current;
};

export default UseAxiosSecure;
