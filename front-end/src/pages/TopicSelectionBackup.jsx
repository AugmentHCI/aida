import Header from "../components/header";
import TopicList from "../components/topicList";
import loadingSpinner from "../components/loadingSpinner";
import "./TopicSelection.css";
import { Progress } from "antd";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import { useLocation } from "react-router-dom";

function TopicSelectionPage() {
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [loadedTopics, setLoadedTopics] = useState([]);
  const [loadedContent, setLoadedContent] = useState([]);

  const location = useLocation();
  const user_id = location.state.userid;

  useEffect(() => {
    setIsLoadingTopics(true);
    fetch("http://127.0.0.1:5000/get_topics")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let topicContent = [];
        let counter = 1;
        setIsLoadingTopics(false);
        setLoadedTopics(data);
        data.chapters.forEach((element) => {
          let topicList = [];
          data.topics.forEach((el) => {
            if (el.chapter == element) {
              topicList.push(el);
            }
          });
          console.log(topicList);

          topicContent.push(
            <div className={"box" + counter}>
              <TopicList chapter={element} topics={topicList}></TopicList>
            </div>
          );

          if (counter == 1) {
            counter = 2;
          } else {
            counter = 1;
          }
        });
        setLoadedContent(topicContent);
      });
  }, []);

  useEffect(() => {
    setIsLoadingSkills(true);
    fetch(
      `http://127.0.0.1:5000/get_user_skills?uid=${encodeURIComponent(
        location.state.userid
      )}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("second fetch: ", data.skills);
        setIsLoadingSkills(false);
      });
  }, []);

  if (isLoadingTopics) {
    return <LoadingSpinner pageName="Oefenen op Nederlands" />;
  }

  if (isLoadingSkills) {
    return <LoadingSpinner pageName="Oefenen op Nederlands" />;
  }

  if (!isLoadingSkills && !isLoadingTopics && isLoadingList) {
    return <LoadingSpinner pageName="Oefenen op Nederlands" />;
  }

  return (
    <div className="topicSelectContainer">
      <Header pageName="Oefenen op Nederlands" />
      <h2>Kies de onderwerpen waarvoor je wilt oefenen</h2>
      <div className="topicList">{loadedContent}</div>

      <div className="recEx">
        <button>Oefeningen aanbevelen</button>
      </div>
    </div>
  );
}

export default TopicSelectionPage;
