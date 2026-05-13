import { Link } from "react-router-dom";

const HTechLogo = () => {
  return (
    <Link 
      to="/" 
      className="
        font-extrabold text-2xl tracking-wide 
        text-white 
        transition-all
        duration-300
        group 
        select-none 
        flex items-center
      "
    >
      <span 
        className="
          group-hover:scale-110 
          group-hover:text-transparent 
          bg-clip-text 
          transition-all 
          duration-500 
          bg-gradient-to-r from-red-400 to-blue-300
        "
      >
        HTech
      </span>
    </Link>
  );
};

export default HTechLogo;
