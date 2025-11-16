import axios from 'axios';

const UseAxiosSecure = () => {
    const axiosSecure=axios.create({
        baseURL: 'http://localhost:8080/api',
    })
    return axiosSecure;
};

export default UseAxiosSecure;