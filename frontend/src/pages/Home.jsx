import React from 'react'
import Hero from '../components/Hero'
import ExclusiveOffers from '../components/ExclusiveOffers'
import FeaturedDestination from '../components/FeaturedDestination'
import NewsLetter from '../components/NewsLetter'
import Testimonial from '../components/Testimonial'

const Home = () => {
  return (
    <div className="">
        <Hero/>
        <FeaturedDestination/>
        <ExclusiveOffers/>
        <Testimonial/>
        <NewsLetter/>
    </div>
  )
}

export default Home