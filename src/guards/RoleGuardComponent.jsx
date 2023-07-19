import React from 'react'
import { useSelector } from 'react-redux';

const RoleGuardComponent = ({ children, rol }) => {

    const { trafficLightBase128 } = useSelector((state) => ({ ...state.auth }));

    console.log(trafficLightBase128)

    return (
        rol.includes(trafficLightBase128?.time) && children?.map((item) => item) 
    )
}

export default RoleGuardComponent