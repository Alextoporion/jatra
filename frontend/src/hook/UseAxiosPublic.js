import axios from 'axios';

const UseAxiosPublic = () => {
    const axiosPublic=axios.create({
        baseURL: 'https://jatra-kn8y.vercel.app/api',
    })
    return axiosPublic;
};

export default UseAxiosPublic;