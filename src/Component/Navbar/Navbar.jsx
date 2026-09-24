import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../Logo/Logo";
import Style from "./Navbar.module.css";

const getStoredNotes = () => {
  try {
    return JSON.parse(localStorage.getItem("notes")) || [];
  } catch {
    return [];
  }
};

const Navbar = ({ darkMode }) => {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return getStoredNotes().filter(
      (note) =>
        (note.title || "").toLowerCase().includes(q) ||
        (note.des || "").toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const openSearch = () => {
    setMenuOpen(false);
    setSearchQuery("");
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div
      className={
        darkMode
          ? `${Style.parent} ${Style.darkNavbar}`
          : Style.parent
      }
    >
      <ul className="flex items-center justify-between">
        <li className="text-4xl">
          <Logo />
        </li>

        <button
          className={Style.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <ul
          className={`flex items-center gap-5 ${
            Style.navLinks
          } ${menuOpen ? Style.showMenu : ""}`}
        >
          <li>
            <Link
              to="/notebook"
              onClick={() => setMenuOpen(false)}
              className={`${Style.navLink} ${
                pathname === "/notebook"
                  ? Style.navLinkActive
                  : ""
              }`}
            >
              Notebook
            </Link>
          </li>

          <li>
            <Link
              to="/about"
              onClick={() => setMenuOpen(false)}
              className={`${Style.navLink} ${
                pathname === "/about"
                  ? Style.navLinkActive
                  : ""
              }`}
            >
              About
            </Link>
          </li>

          <button
            className="greenButton"
            onClick={openSearch}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            {" "}Search
          </button>
        </ul>
      </ul>

      <hr className="border-gray-500" />

      {searchOpen && (
        <div
          className={`fixed inset-0 z-9999 flex items-start justify-center pt-24 px-4 ${
            darkMode ? Style.darkSearchModal : "bg-black/80 backdrop-blur-xl"
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div
            className={`relative w-full max-w-xl rounded-3xl p-6 shadow-2xl ${
              darkMode ? Style.darkSearchPanel : "bg-[#D6D6D6]"
            }`}
          >
            <button
              onClick={closeSearch}
              aria-label="Close search"
              className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300 ${
                darkMode
                  ? Style.searchCloseBtn
                  : "bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white"
              }`}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <h2 className="text-2xl font-bold pr-12">Search Sticky Notes</h2>

            <div className="mt-5 flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass opacity-60"></i>
              <input
                autoFocus
                type="text"
                placeholder="Search by title or note text…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeSearch();
                }}
                className={`w-full rounded-xl border px-4 py-3 outline-none transition-all duration-300 ${
                  darkMode
                    ? Style.darkSearchInput
                    : "border-gray-300 bg-[#B6B6B6] focus:border-[#4F5CFF] focus:bg-[#e6e6e6] focus:ring-4 focus:ring-blue-100"
                }`}
              />
            </div>

            <div className="mt-5 max-h-[50vh] overflow-y-auto space-y-3">
              {searchQuery.trim() === "" ? (
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Type to search your sticky notes.
                </p>
              ) : searchResults.length === 0 ? (
                <p
                  className={`text-sm font-medium ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  No results found.
                </p>
              ) : (
                searchResults.map((note) => (
                  <div
                    key={note.id}
                    className={`rounded-xl border px-4 py-3 ${
                      darkMode
                        ? Style.darkSearchResultItem
                        : "border-gray-300 bg-white/60"
                    }`}
                  >
                    <p className="font-semibold bubblegum-sans-regular">
                      {note.title || "Untitled"}
                    </p>
                    <p className="text-sm mt-1 caveat-card line-clamp-2">
                      {note.des}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;