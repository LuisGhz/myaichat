import { Link } from "react-router";
import { ArrowLeftCircleIcon } from "assets/icons/ArrowLeftCircleIcon";
import { PencilSquareIcon } from "assets/icons/PencilSquareIcon";
import { ScreensWidth } from "consts/ScreensWidth";
import {
  useAppIsMenuOpenStore,
  useAppSetIsMenuOpenStore,
} from "store/useAppStore";
import MyAIChatLogo from "/public/myaichat.png";

export const HeaderNav = () => {
  const isMenuOpen = useAppIsMenuOpenStore();
  const setIsMenuOpen = useAppSetIsMenuOpenStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMenuMobile = () => {
    if (window.innerWidth < ScreensWidth.tablet) setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <ul className={`px-1`}>
        <li className="flex justify-between items-center px-2 py-1">
          <Link className="mt-0.5" to={"/"} aria-label="Go to homepage">
            <img
              className="w-8 h-8 rounded-full"
              src={MyAIChatLogo}
              alt="My AI Chat"
            />
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Close sidebar menu"
          >
            <ArrowLeftCircleIcon className="size-7 cursor-pointer text-white hover:text-gray-300 transition-colors duration-300 mt-1" />
          </button>
        </li>
        <li className="bg-cop-1 hover:bg-cop-2 cursor-pointer text-white px-2 py-1 text-center w-10/12 mx-auto rounded-sm transition-colors duration-300 my-3">
          <Link
            className="flex justify-center"
            to={"/chat"}
            aria-label="New conversation"
            onClick={toggleMenuMobile}
          >
            <PencilSquareIcon className="size-5 text-white me-2 mt-0.5" />
            <span>New conversation</span>
          </Link>
        </li>
        <li className="bg-cop-1 hover:bg-cop-2 cursor-pointer text-white px-2 py-1 text-center w-10/12 mx-auto rounded-sm transition-colors duration-300 my-3">
          <Link
            className="flex justify-center"
            to={"/prompts"}
            aria-label="New conversation"
            onClick={toggleMenuMobile}
          >
            <span>Prompts</span>
          </Link>
        </li>
      </ul>
    </>
  );
};
