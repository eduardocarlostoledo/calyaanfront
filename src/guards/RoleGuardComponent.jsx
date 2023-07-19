import React from 'react'
import { useSelector } from 'react-redux';

const RoleGuardComponent = ({ children, rol }) => {

    const { trafficLightBase128 } = useSelector((state) => ({ ...state.auth }));

    return (
        rol.includes(trafficLightBase128) && children?.map((item) => item) 
    )
}

export default RoleGuardComponent