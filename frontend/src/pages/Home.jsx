import React from 'react'
import Hero from '../components/Hero'
import InteractiveExperience from '../components/InteractiveExperience'
import ExclusiveOffers from '../components/ExclusiveOffers'
import FeaturedDestination from '../components/FeaturedDestination'
import Testimonial from '../components/Testimonial'

const Home = () => {
  return (
    <div className="">
        <Hero/>
        <FeaturedDestination/>
        <InteractiveExperience/>
        <ExclusiveOffers/>
        <Testimonial/>
    </div>
  )
}

export default Home