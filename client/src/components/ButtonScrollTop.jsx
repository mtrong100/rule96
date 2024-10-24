import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ButtonScrollTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`rounded-full fixed z-50 bottom-5 border border-gray-600 right-5 md:right-10 shadow-lg text-white lg:right-10 hover:bg-zinc-600 w-[50px] h-[50px] items-center justify-center bg-zinc-700 ${
        isVisible ? "flex" : "hidden"
      }`}
      onClick={scrollToTop}
    >
      <ArrowUp />
    </button>
  );
};

export default ButtonScrollTop;
