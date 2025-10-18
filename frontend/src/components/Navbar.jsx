import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";
import { NavItems } from "../constants";
import { Link } from "react-router-dom";

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
      className={`w-screen text-white max-h-[90px] h-full flex flex-row items-center justify-between max-lg:pl-3 lg:justify-center lg:px-[3.5rem] fixed top-0 z-[999] transition-all duration-300 ${
        scrolled ? "bg-gray-900/[.5] backdrop-blur" : "bg-transparent"
      }`}
    >
      <a 
        href="/" 
        title="MVMS"
        aria-label="MVMS Website"
        className="mr-10 mt-2"
      >
        <p className="text-2xl font-bold">MVMS</p>
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

      <div
        className={`text-[#FAFAFA]/[.62] transition-all duration-300 ease-in-out font-satoshi font-bold lg:static lg:w-max lg:h-max lg:pt-0 lg:bg-transparent lg:block  fixed top-0 w-screen h-screen z-[-1] text-center items-center ${
          mobilenav
            ? "right-0 flex flex-col gap-[50px] bg-gray-900/[.7] backdrop-blur pt-24"
            : "right-full flex flex-col gap-8 text-opacity-0"
        }`}
      >
        {NavItems.map((item, index) => (
          <a
            key={index}
            href={item.link}
            className="font-satoshi text-lg hover:bg-gradient-to-r hover:from-[#4712b8] hover:to-[#309ff4] hover:bg-clip-text hover:text-xl hover:text-transparent group transition-all duration-300 ease-in-out lg:ml-8"
            onClick={() => mobilenav && setmobilenav(!mobilenav)}
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
