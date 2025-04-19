import { ArrowLeftCircleIcon } from "assets/icons/ArrowLeftCircleIcon";
import { PencilSquareIcon } from "assets/icons/PencilSquareIcon";
import { ScreensWidth } from "consts/ScreensWidth";
import { AppContext } from "context/AppContext";
import { useContext } from "react";
import { Link } from "react-router";

export const HeaderNav = () => {
  const { setIsMenuOpen } = useContext(AppContext);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleMenuMobile = () => {
    if (window.innerWidth < ScreensWidth.tablet) setIsMenuOpen((prev) => !prev);
  };

  return (
    <>
      <ul className={`px-1`}>
        <li className="flex justify-between items-center px-2 py-1">
          <Link className="mt-0.5" to={"/"} aria-label="Go to homepage">
            MyAIChat
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Close sidebar menu"
          >
            <ArrowLeftCircleIcon className="size-6 cursor-pointer text-white hover:text-gray-300 transition-colors duration-300 mt-1" />
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
