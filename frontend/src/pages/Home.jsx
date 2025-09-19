import React from 'react'
import Hero from '../components/Hero'
import ExclusiveOffers from '../components/ExclusiveOffers'
import FeaturedDestination from '../components/FeaturedDestination'
import Testimonial from '../components/Testimonial'

const Home = () => {
  return (
    <div className="">
        <Hero/>
        <FeaturedDestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        
    </div>
  )
}

export default Home