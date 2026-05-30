import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import TiltCard from './TiltCard'

const HotelCard = ({ room, index }) => {
  const fallbackImg = room?.images?.[0] || 'https://placehold.co/400x300?text=Hotel'
  const hotelName = room?.hotel?.name || 'Hotel'
  const hotelAddress = room?.hotel?.address || room?.hotel?.location?.city || ''

  return (
    <TiltCard tiltDegree={6} glare={false}>
      <Link to={'/rooms/' + room._id} onClick={() => scrollTo(0, 0)}
        className='relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)] block group'
      >
        <div className='overflow-hidden'>
          <img src={fallbackImg} alt="" className='group-hover:scale-105 transition-transform duration-500' />
        </div>

        {index % 2 === 0 && (
          <span className='px-3 py-1 absolute top-3 left-3 text-xs bg-white/90 backdrop-blur text-gray-800 font-medium rounded-full shadow-sm'>
            Best Seller
          </span>
        )}

        <div className='p-4 pt-5'>
          <div className='flex items-center justify-between'>
            <p className='font-playfair text-xl font-medium text-gray-800'>{hotelName}</p>
            <div className='flex items-center gap-1'>
              <img src={assets.starIconFilled} alt="star-icon" /> 4.5
            </div>
          </div>
          <div className='flex items-center gap-1 text-sm'>
            <img src={assets.locationIcon} alt="location-icon" />
            <span>{hotelAddress}</span>
          </div>
          <div className='flex items-center justify-between mt-4'>
            <p><span className='text-xl text-gray-800'>${room.pricePerNight}</span>/night</p>
            <span className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 active:scale-95 transition-all cursor-pointer'>
              Book Now
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  )
}

export default HotelCard
