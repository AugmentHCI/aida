import { BounceLoader } from "react-spinners";
import Header from "./header";
import React from "react";
import "./loadingSpinner.css";

function LoadingSpinner(props) {
  return (
    <div>
      <Header pageName={props.pageName}></Header>
      <div className="sweet-loading">
        <h1>Loading</h1>
        <BounceLoader size={100} color={"#3d5a80"} speedMultiplier={1} />
      </div>
    </div>
  );
}

export default LoadingSpinner;
