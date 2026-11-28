import React from "react";
// import House from "lucide-react"
import { Link, NavLink } from "react-router-dom";

const Button = ({ logo, data, path }) => {
  return (
    <NavLink
      key={path}
       to={path}
      end={path === "/dashboard"}
      className="
 sidebar-link 
"
    >
      <span className="">{logo}</span> {data}
    </NavLink>
  );
};

export default Button;
