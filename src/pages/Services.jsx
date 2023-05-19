import React, { lazy } from 'react'
import { services } from '../data'

const Footer = lazy(() => import('../components/Footer'))
const Header = lazy(() => import('../components/Header'))
const Filters = lazy(() => import('../components/Filters'))
const Card = lazy(() => import('../components/Card'))

const Services = () => {
  return (
    <div
      className="mx-auto p-8 flex gap-4 3xl:gap-8 bg-whitefull-screen flex-wrap items-center justify-center"
    >
      {
        services?.map((service) => (
          <Card key={service.id} image={service.image} text={service.text} count={service.count} link={service.link} />
        ))
      }
    </div>
  )
}

export default Services