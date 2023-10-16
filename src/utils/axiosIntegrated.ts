import axios from 'axios';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: 'https://solarcapstone.azurewebsites.net/',
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;
