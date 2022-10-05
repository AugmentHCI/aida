import React from "react";
import WhatifGraph from "../components/whatifGraph";

function WatalsList(props) {
  let whatifGraphContent = [];

  props.data.forEach((element) => {
    console.log("el :", element);

    let whatifComponent = (
      <WhatifGraph
        name={element.name}
        deel={element.deel}
        userLevel={element.userSkillLevel}
        levelName={element.userSkillName}
        updatedUserLevel={element.updatedUserSkillLevel}
      />
    );
    whatifGraphContent.push(whatifComponent);
  });

  return (
    <div className="wat-als-expl">
      <div className="textContainer">
        <h2>Wat als je alles correct oplost?</h2>
        <p>Dit is de voortgang dat het systeem schat dat je zal maken.</p>
      </div>

      {whatifGraphContent}
    </div>
  );
}

export default WatalsList;
