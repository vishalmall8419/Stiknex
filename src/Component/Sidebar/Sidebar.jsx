import { Link } from "react-router-dom";
import Style from "./Sidebar.module.css";
import swal from "sweetalert";

const Sidebar = ({
  openForm,
  checkeddata,
  deleteSelected,
  toggleDarkMode,
  darkMode,
}) => {
  const deleteAlert = (e) => {
    swal({
      title: "Delete Note?",
      text: "This note will be permanently deleted and cannot be recovered.",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (
          checkeddata.length === 0 ||
          checkeddata === null ||
          checkeddata === ""
        ) {
          e.target.classList.add(Style.disabled);
        } else {
          deleteSelected(checkeddata);
        }

        swal({
          title: "Deleted!",
          text: "Your note has been deleted successfully.",
          icon: "success",
        });
      } else {
        swal({
          title: "Cancelled",
          text: "Your note is safe.",
          icon: "info",
        });
      }
    });
  };

  return (
    <div className="fixed top-4">
      <div
        className={`${Style.parent} ${darkMode ? Style.darkSidebar : ""}`}
      >
        <ul
          className={`flex flex-col justify-around ${
            darkMode ? Style.darkMenu : ""
          }`}
        >
          <li className={Style.tooltipWrap} data-tooltip="Create Note">
            <button onClick={openForm}>
              <i className="fa-solid fa-plus"></i>
            </button>
          </li>

          <li className={Style.tooltipWrap} data-tooltip="Delete Selected">
            <button
              onClick={deleteAlert}
              disabled={checkeddata.length === 0}
              className={checkeddata.length === 0 ? Style.disabled : ""}
            >
              <i className="fa-solid fa-trash-can"></i>
            </button>
          </li>

          <hr />

          <li
            className={Style.tooltipWrap}
            data-tooltip={darkMode ? "Light Mode" : "Dark Mode"}
          >
            <button onClick={toggleDarkMode}>
              <i
                className={`fa-solid ${darkMode ? "fa-sun" : "fa-moon"}`}
              ></i>
            </button>
          </li>

          <li className={Style.tooltipWrap} data-tooltip="Tools">
            <Link to="/tools">
              <i className="fa-solid fa-screwdriver-wrench"></i>
            </Link>
          </li>

          <li className={Style.tooltipWrap} data-tooltip="Buy Me A Coffee">
            <Link to="/buy-me-a-coffee">
              <i className="fa-solid fa-mug-saucer"></i>
            </Link>
          </li>

          <li className={Style.tooltipWrap} data-tooltip="Portfolio">
            <a
              href="https://vishalmall.vercel.app/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-laptop-code"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
