import React from "react";
import WaaromGraph from "../components/waaromGraph";

function WaaromList(props) {
  let waaromGraphContent = [];
  props.data.forEach((element) => {
    let component = (
      <WaaromGraph
        name={element.name}
        deel={element.deel}
        data={element.exercise_list}
        userLevel={element.userSkillLevel}
        levelName={element.userSkillName}
      ></WaaromGraph>
    );
    waaromGraphContent.push(component);
  });

  return (
    <div className="waarom-expl">
      <div className="textContainer">
        <h2>Waarom deze reeks?</h2>
        <p>Deze oefeningen liggen het dichtst bij jouw niveau.</p>
      </div>

      {waaromGraphContent}
    </div>
  );
}

export default WaaromList;
