import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRightCircleIcon } from "assets/icons/ArrowRightCircleIcon";
import { PencilSquareIcon } from "assets/icons/PencilSquareIcon";
import { ScreensWidth } from "consts/ScreensWidth";
import { ChatsNav } from "./ChatsNav";

export const SideNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= ScreensWidth.tablet) return;
      const isMenuOpenMobile =
        window.innerWidth < ScreensWidth.tablet ? !isMenuOpen : isMenuOpen;
      if (
        !!navRef.current &&
        !!openRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !openRef.current?.contains(event.target as Node) &&
        isMenuOpenMobile
      ) {
        setIsMenuOpen(() => !isMenuOpen);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <section className="absolute top-0 left-0 z-50 flex text-white gap-x-2 mt-1 -ms-1.5">
        <Link className="mt-1 ms-2.5" aria-label="Go to home page" to={"/"}>
          MyAIChat
        </Link>
        <button
          className="cursor-pointer"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="sidebar-menu"
          aria-label={"Open sidebar menu"}
          onClick={toggleMenu}
          ref={openRef}
        >
          <ArrowRightCircleIcon className="size-6 mt-1" />
        </button>
        <Link
          className="flex justify-center"
          to={"/chat"}
          aria-label="New conversation"
        >
          <PencilSquareIcon className="size-6 text-white me-2 mt-1" />
        </Link>
      </section>
      <nav
        className={`${
          isMenuOpen ? "w-0 md:w-64" : "w-0"
        } transition-width duration-500 relative bg-cop-4 `}
        role="navigation"
        aria-label="Chat navigation"
        ref={navRef}
      >
        <ChatsNav isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
      </nav>
    </>
  );
};
