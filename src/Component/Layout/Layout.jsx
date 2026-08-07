import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import BuyMeCoffeeButton from "../BuyMeCoffeeButton/BuyMeCoffeeButton";
import useDarkMode from "../../hooks/useDarkMode";
import Style from "../../Pages/Home/Home.module.css";

const Layout = ({
  children,
  sidebarProps = {},
  hideNavbar = false,
  hideSidebar = false,
  hideCoffeeButton = false,
}) => {
  const [darkMode, toggleDarkMode] = useDarkMode();

  const {
    openForm = () => {},
    checkeddata = [],
    deleteSelected = () => {},
  } = sidebarProps;

  return (
    <div
      className={
        darkMode
          ? `${Style.homebeforimage} ${Style.darkHome}`
          : Style.homebeforimage
      }
    >
      <div
        className={
          darkMode
            ? `${Style.darkBody} relative min-h-screen`
            : "relative min-h-screen bg-[#D6D6D6] opacity-95"
        }
      >
        {!hideNavbar && <Navbar darkMode={darkMode} />}

        {!hideSidebar && (
          <Sidebar
            openForm={openForm}
            checkeddata={checkeddata}
            deleteSelected={deleteSelected}
            toggleDarkMode={toggleDarkMode}
            darkMode={darkMode}
          />
        )}

        {typeof children === "function"
          ? children(darkMode, toggleDarkMode)
          : children}

        {!hideCoffeeButton && <BuyMeCoffeeButton darkMode={darkMode} />}
      </div>
    </div>
  );
};

export default Layout;
