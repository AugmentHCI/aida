import React from "react";
import "./userCard.css";
import { useNavigate } from "react-router-dom";

function UserCard(props) {
  const navigate = useNavigate();

  function userHandler() {
    console.log("clicked");
    console.log(props.userId);
    navigate("/", { state: { userid: props.userId } });
  }

  return (
    <div className="userCardContainer">
      <div className="title">
        <h1>User{props.userId}</h1>
      </div>
      <div className="topicInfo">
        <p>Total exercises made: {props.topic_info.amount_ex_made}</p>
        <div className="topicContainer">
          <p style={{ fontWeight: "bold", color: "#3d5a80" }}>
            On following topics:{" "}
          </p>{" "}
          {props.topic_info.topics.map((topic) => (
            <p>{topic}</p>
          ))}
        </div>
        <div className="topicExerciseContainer">
          <h2>Exercises made per topic</h2>
          {props.topic_ex_list.map((topic_ex) => (
            <ul>
              <li>
                <div>
                  <p>
                    {topic_ex.topic}: {topic_ex.ex_made}
                  </p>
                </div>
              </li>
            </ul>
          ))}
        </div>
      </div>
      <div className="interactionContainer">
        <h2>Interaction sequence</h2>
        <div className="horizontalWrapper">
          {props.interactions.map((interaction) => (
            <div className="horizontalItem">
              <p>Topic: {interaction.topic}</p>
              <p>Exercise: {interaction.ex_id}</p>
              <p>Made at: {interaction.made_at}</p>
              <p>
                Score: {interaction.score} at {interaction.max_score}
              </p>
              {/* }  <iframe
                src={interaction.link + "/embed"}
                height="200"
                width="300"
                title="Iframe Example"
                id="myFrame"
          ></iframe>*/}
            </div>
          ))}
        </div>
      </div>
      <div className="chooseUser">
        <button onClick={userHandler}>Choose me!</button>
      </div>
    </div>
  );
}

export default UserCard;
