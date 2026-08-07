import { useNavigate, useLocation } from "react-router-dom";
import Style from "./BuyMeCoffeeButton.module.css";

const BuyMeCoffeeButton = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/buy-me-a-coffee") return null;

  return (
    <button
      type="button"
      className={`${Style.floatingBtn} ${darkMode ? Style.darkFloatingBtn : ""}`}
      onClick={() => navigate("/buy-me-a-coffee")}
      aria-label="Buy Me A Coffee"
      title="Buy Me A Coffee"
    >
      <i className="fa-solid fa-mug-saucer"></i>
    </button>
  );
};

export default BuyMeCoffeeButton;
