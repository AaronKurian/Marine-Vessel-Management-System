import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { NavItems } from "../constants";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [mobilenav, setmobilenav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 5) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      document.body.style.overflowY = mobilenav ? "hidden" : "auto";
    }
  }, [mobilenav]);

  return (
    <div
      className={`w-screen text-white max-h-[90px] h-full flex flex-row items-center justify-between max-lg:pl-3 lg:px-[3.5rem] fixed top-0 z-[999] transition-all duration-300 ${
        scrolled ? "bg-gray-900/[.5] backdrop-blur" : "bg-transparent"
      }`}
    >
      <a 
        href="/" 
        title="Marine Vessel Management System"
        aria-label="Marine Vessel Management System Website"
        className="mt-2 z-10 border-2 border-blue-800/60 rounded-full p-1 shadow-[0_0_12px_2px_rgba(80,200,255,0.6),0_0_24px_4px_rgba(80,200,255,0.3)] animate-pulse"
      >
        <img src={logo} alt="Marine Vessel Management System Logo" className="w-12 h-12 rounded-full " />
      </a>

      <button
        onClick={() => setmobilenav(!mobilenav)}
        className="text-4xl block lg:hidden mr-3"
      >
        {!mobilenav ? (
          <RxHamburgerMenu className="text-[40px]" />
        ) : (
          <IoCloseOutline className="text-[40px]" />
        )}
      </button>

      <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:flex-row lg:items-center lg:gap-8 text-[#FAFAFA]/[.62] font-satoshi font-bold">
        {NavItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="font-satoshi text-lg hover:bg-gradient-to-r hover:from-[#4712b8] hover:to-[#309ff4] hover:bg-clip-text hover:text-xl hover:text-transparent group transition-all duration-300 ease-in-out"
          >
            {item.title}
          </a>
        ))}
      </div>

      <div
        className={`lg:hidden text-[#FAFAFA]/[.62] transition-all duration-300 ease-in-out font-satoshi font-bold fixed top-0 w-screen h-screen z-[-1] text-center flex flex-col items-center ${
          mobilenav
            ? "right-0 gap-[50px] bg-gray-900/[.7] backdrop-blur pt-24"
            : "right-full gap-8 text-opacity-0"
        }`}
      >
        {NavItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="font-satoshi text-lg hover:bg-gradient-to-r hover:from-[#4712b8] hover:to-[#309ff4] hover:bg-clip-text hover:text-xl hover:text-transparent group transition-all duration-300 ease-in-out"
            onClick={() => setmobilenav(false)}
          >
            {item.title}
          </a>
        ))}
        <Link
          to="/signin"
          className="px-6 py-2 bg-indigo-900/80 hover:bg-indigo-700 text-white rounded-full border border-white/10 transition-colors font-medium"
          onClick={() => setmobilenav(false)}
        >
          Login
        </Link>
      </div>

      <Link
        to="/signin"
        className="hidden lg:block px-6 py-2 bg-indigo-900/80 hover:bg-indigo-700 text-white rounded-full border border-white/10 transition-colors font-medium"
      >
        Login
      </Link>

    </div>
  );
};

export default Navbar;
