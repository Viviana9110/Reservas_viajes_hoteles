import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Navbar = () => {
  const { user, setShowUserLogin, navigate, logoutUser } = useAppContext();
  
  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
      <Link to="/"> 
        <img src={assets.logoTour} alt="logo" className="w-25" />
      </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p>Bienvenido! {user.name}</p>
                    
                    <button onClick={() => {logoutUser(), setOpen(false)}} className='border rounded-full text-sm px-4 py-1 cursor-pointer'>Logout</button>
                    
                </div>
            </div>
  )
}

export default Navbar