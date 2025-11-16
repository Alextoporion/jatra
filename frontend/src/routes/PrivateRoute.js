import React from 'react';
import UseAuth from '../hook/UseAuth';
import { Navigate, replace } from 'react-router-dom';

const PrivateRoute = ({children,allowedRoles}) => {
    const {user,isAuthenticated,loading}=UseAuth();

    if(loading){
        return <div>Loading...</div>;
    }
    if(!isAuthenticated){return <Navigate to='/login' replace={true}/>}
    if( !allowedRoles.includes(user?.role)){
        return <Navigate to='/unauthorized' replace/>
    }
    return children;
};

export default PrivateRoute;