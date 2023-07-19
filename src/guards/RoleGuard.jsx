import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const RoleGuard = ({ rol }) => {

    const { user } = useSelector((state) => ({ ...state.auth }));

    return (
        rol.includes(user?.trafficLightBase128) ? <Outlet /> : <Navigate to="/servicios" replace={true} />
    )
}

export default RoleGuard





