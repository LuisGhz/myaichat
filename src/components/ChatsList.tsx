import { ArrowLeftCircleIcon } from "assets/icons/ArrowLeftCircleIcon";
import { ArrowRightCircleIcon } from "assets/icons/ArrowRightCircleIcon";
import { PencilSquareIcon } from "assets/icons/PencilSquareIcon";
import { TrashIcon } from "assets/icons/TrashIcon";
import { ScreensWidth } from "consts/ScreensWidth";
import { AppContext } from "context/AppContext";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

export const ChatsList = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { chats, deleteChatById } = useContext(AppContext);
  const navRef = useRef<HTMLElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const params = useParams();
  const navigate = useNavigate();

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

  const handleDeleteChat = (id: string) => {
    deleteChatById(id);
    if (params.id === id) navigate("/chat");
  };

  const handleRedirectToChatOnMobile = () => {
    if (window.innerWidth < ScreensWidth.tablet) toggleMenu();
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
        <ul
          className={`bg-cop-4 text-white h-full px-3 overflow-y-auto overflow-x-hidden hide-scrollbar fixed md:relative top-0 left-0 z-50 transition-all duration-500 w-64 ${
            isMenuOpen
              ? "-translate-x-full md:translate-x-0"
              : "translate-x-0 md:-translate-x-full"
          } shadow-lg md:shadow-none`}
        >
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
            >
              <PencilSquareIcon className="size-5 text-white me-2 mt-0.5" />
              <span>New conversation</span>
            </Link>
          </li>
          {chats.length > 0 &&
            chats.map((chat) => (
              <li
                className="my-3 hover:bg-cop-6 transition-colors duration-300 rounded-lg flex justify-between"
                key={chat.id}
              >
                <Link
                  to={`/chat/${chat.id}`}
                  className="block whitespace-nowrap overflow-hidden text-ellipsis h-11 px-2 py-2"
                  aria-label={`Open chat: ${chat.title}`}
                  onClick={handleRedirectToChatOnMobile}
                >
                  {chat.title}
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteChat(chat.id)}
                  aria-label={`Delete chat: ${chat.title}`}
                >
                  <TrashIcon className="w-5 min-w-5 text-white cursor-pointer hover:text-gray-600 transition-colors duration-300" />
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
};
