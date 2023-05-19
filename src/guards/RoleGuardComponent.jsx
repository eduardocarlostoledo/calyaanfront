import React from 'react'
import { useSelector } from 'react-redux';

const RoleGuardComponent = ({ children, rol }) => {

    const { user } = useSelector((state) => ({ ...state.auth }));

    return (
        rol.includes(user?.rol) && children?.map((item) => item) 
    )
}

export default RoleGuardComponent