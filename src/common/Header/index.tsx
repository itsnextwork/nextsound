import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { BsMoonStarsFill } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { FiSun } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
import throttle from "lodash.throttle";
import { Button } from "react-aria-components";

import { ThemeMenu, Logo } from "..";
import HeaderNavItem from "./HeaderNavItem";

import { useGlobalContext } from "@/context/globalContext";
import { useTheme } from "@/context/themeContext";
import { maxWidth } from "@/styles";
import { navLinks } from "@/constants";
import { THROTTLE_DELAY } from "@/utils/config";
import { cn } from "@/utils/helper";

interface HeaderProps {
  onOpenSearch?: () => void;
}

const Header = ({ onOpenSearch }: HeaderProps) => {
  const { openMenu, theme, showThemeOptions } = useTheme();
  const { setShowSidebar } = useGlobalContext();

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isNotFoundPage, setIsNotFoundPage] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const handleBackgroundChange = () => {
      const body = document.body;
      if (
        window.scrollY > 0 ||
        (body.classList.contains("no-scroll") &&
          parseFloat(body.style.top) * -1 > 0)
      ) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    const throttledHandleBackgroundChange = throttle(
      handleBackgroundChange,
      THROTTLE_DELAY
    );

    window.addEventListener("scroll", throttledHandleBackgroundChange);

    return () => {
      window.removeEventListener("scroll", throttledHandleBackgroundChange);
    };
  }, []);

  useEffect(() => {
    if (location.pathname.split("/").length > 3) {
      setIsNotFoundPage(true);
    } else {
      setIsNotFoundPage(false);
    }
  }, [location.pathname]);

  return (
    <header
      className={cn(
        `md:py-[16px] py-[14.5px]  fixed top-0 left-0 w-full z-10 transition-all duration-50`,
        isActive && (theme === "Dark" ? "header-bg--dark" : "header-bg--light")
      )}
    >
      <nav
        className={cn(maxWidth, `flex justify-between flex-row items-center`)}
      >
        <Logo
          logoColor={cn(
            isNotFoundPage
              ? "text-black dark:text-white"
              : !isNotFoundPage && isActive
              ? "text-black dark:text-white"
              : "text-white"
          )}
        />

        <div className=" hidden md:flex flex-row gap-8 items-center text-gray-600 dark:text-gray-300">
          <ul className="flex flex-row gap-8 capitalize text-[14.75px] font-medium">
            {navLinks.map((link: { title: string; path: string }) => {
              return (
                <HeaderNavItem
                  key={link.title}
                  link={link}
                  isNotFoundPage={isNotFoundPage}
                  showBg={isActive}
                />
              );
            })}
          </ul>

          {/* Search Button */}
          <Button
            onPress={onOpenSearch}
            className={cn(
              "flex items-center justify-center px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 border border-gray-300 dark:border-gray-600",
              isNotFoundPage || isActive
                ? "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20"
            )}
          >
            <FiSearch className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Search</span>
            <kbd className={cn(
              "ml-2 px-1.5 py-0.5 text-xs font-mono rounded border text-[10px]",
              isNotFoundPage || isActive
                ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                : "bg-white/10 border-white/20 text-gray-300"
            )}>
              ⌘K
            </kbd>
          </Button>

          <div className="button relative">
            <button
              name="theme-menu"
              type="button"
              onClick={openMenu}
              id="theme"
              className={cn(
                `flex items-center justify-center mb-[2px] transition-all duration-100 hover:scale-110`,
                isNotFoundPage || isActive
                  ? ` text-black dark:text-white dark:hover:text-gray-300 hover:text-gray-600 `
                  : ` dark:hover:text-sec-color text-gray-300 `
              )}
            >
              {theme === "Dark" ? <BsMoonStarsFill /> : <FiSun />}
            </button>
            <AnimatePresence>
              {showThemeOptions && <ThemeMenu />}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="button"
          name="menu"
          className={cn(
            `inline-block text-[22.75px] md:hidden  transition-all duration-300`,
            isNotFoundPage || isActive
              ? `text-black dark:text-white dark:hover:text-gray-300 hover:text-gray-600 `
              : ` dark:hover:text-sec-color text-sec-color`
          )}
          onClick={() => setShowSidebar(true)}
        >
          <AiOutlineMenu />
        </button>
      </nav>
    </header>
  );
};

export default Header;
