import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRightCircleIcon } from "assets/icons/ArrowRightCircleIcon";
import { PencilSquareIcon } from "assets/icons/PencilSquareIcon";
import { ScreensWidth } from "consts/ScreensWidth";
import { ChatsNav } from "./ChatsNav";
import { HeaderNav } from "./HeaderNav";
import {
  useAppIsMenuOpenStore,
  useAppSetIsMenuOpenStore,
} from "store/useAppStore";
import MyAIChatLogo from "assets/myaichat.png";

export const SideNav = () => {
  const isMenuOpen = useAppIsMenuOpenStore();
  const setIsMenuOpen = useAppSetIsMenuOpenStore();
  const navRef = useRef<HTMLElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= ScreensWidth.smallDesktop) return;
      const isMenuOpenMobile =
        window.innerWidth < ScreensWidth.smallDesktop
          ? !isMenuOpen
          : isMenuOpen;
      const contextMenu = document.querySelector(".sidenav-context-menu");
      if (
        !!navRef.current &&
        !!openRef.current &&
        !navRef.current.contains(event.target as Node) &&
        !openRef.current?.contains(event.target as Node) &&
        !contextMenu?.contains(event.target as Node) &&
        isMenuOpenMobile
      ) {
        setIsMenuOpen(!isMenuOpen);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <section className="absolute top-0 left-0 z-10 flex text-white gap-x-3 mt-1 -ms-1.5">
        <Link
          className="mt-1 ms-2.5 text-lg"
          aria-label="Go to home page"
          to={"/"}
        >
          <img
            className="w-8 h-8 rounded-full"
            src={MyAIChatLogo}
            alt="My ai chat icon"
          />
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
          <ArrowRightCircleIcon className="size-7 mt-1" />
        </button>
        <Link
          className="flex justify-center"
          to={"/chat"}
          aria-label="New conversation"
        >
          <PencilSquareIcon className="size-7 text-white me-2 mt-1" />
        </Link>
      </section>
      <nav
        className={`absolute h-full ${
          isMenuOpen
            ? "-translate-x-full lg:translate-x-0"
            : "translate-x-0 lg:-translate-x-full"
        } transition-all duration-500 w-72 z-20 bg-cop-4 text-white overflow-y-auto hide-scrollbar`}
        role="navigation"
        aria-label="Chat navigation"
        ref={navRef}
      >
        <HeaderNav />
        <ChatsNav />
      </nav>
    </>
  );
};
