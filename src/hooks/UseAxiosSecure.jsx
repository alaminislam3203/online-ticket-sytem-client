import axios from 'axios';
import { useRef, useEffect } from 'react';

const UseAxiosSecure = () => {
  const instanceRef = useRef(
    axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    }),
  );

  useEffect(() => {
    const reqInterceptor = instanceRef.current.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
    );

    return () => {
      instanceRef.current.interceptors.request.eject(reqInterceptor);
    };
  }, []);

  return instanceRef.current;
};

export default UseAxiosSecure;
