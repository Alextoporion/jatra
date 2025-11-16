import { AuthContext } from '../authprovider/AuthProvider';
import { useContext } from 'react';


const UseAuth = () => {
    const auth = useContext(AuthContext);
    return auth;
};

export default UseAuth;