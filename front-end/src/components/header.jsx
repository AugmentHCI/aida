import React from "react";
import "./header.css";

function Header(props) {
  return (
    <div className="header">
      <h1 className="logo">AIDA</h1>
      <h1 className="pageName">{props.pageName}</h1>
    </div>
  );
}

export default Header;
