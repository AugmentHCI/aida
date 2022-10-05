import Header from "../components/header";
import TopicList from "../components/topicList";
import "./TopicSelection.css";
import { useState, useEffect } from "react";
import LoadingSpinner from "../components/loadingSpinner";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";

function TopicSelectionPage() {
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadedTopics, setLoadedTopics] = useState([]);
  const [loadedContent, setLoadedContent] = useState([]);
  const [loadedSkills, setLoadedSkills] = useState([]);
  const [selectedTopicList, setSelectedTopicList] = useState([]);

  const location = useLocation();
  let selectedListTopic = [];

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoadingTopics(true);
    fetch("http://127.0.0.1:5000/get_topics")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setIsLoadingTopics(false);
        setLoadedTopics(data);
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
        setLoadedSkills(data);
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
    let topicContent = [];
    let counter = 1;
    let childId = 1;
    loadedTopics.chapters.forEach((element) => {
      let topicList = [];
      loadedTopics.topics.forEach((el) => {
        if (el.chapter == element) {
          loadedSkills.skills.forEach((skill) => {
            if (el.skill_id == skill.skill_id) {
              el.niveau = skill.name;
            }
          });
          topicList.push(el);
        }
      });

      let component = (
        <TopicList
          id={childId}
          chapter={element}
          topics={topicList}
          onGetSelectedRows={handleGetSelectedRows}
        ></TopicList>
      );
      childId += 1;
      topicContent.push(<div className={"box" + counter}>{component}</div>);

      if (counter == 1) {
        counter = 2;
      } else {
        counter = 1;
      }
    });
    setLoadedContent(topicContent);
    setIsLoadingList(false);
    return <LoadingSpinner pageName="Oefenen op Nederlands" />;
  }

  function handleGetSelectedRows(childId, selectedTopics) {
    if (selectedListTopic.length == 0) {
      selectedListTopic.push({ id: childId, topic: selectedTopics });
    } else {
      let count = 0;
      let idFound = 0;
      selectedListTopic.forEach((topicEl) => {
        count += 1;
        if (topicEl.id == childId) {
          topicEl.topic = selectedTopics;
          setSelectedTopicList(selectedListTopic);
          idFound = 1;
        } else if (count == selectedListTopic.length && idFound == 0) {
          selectedListTopic.push({ id: childId, topic: selectedTopics });
        }
      });
    }
    setSelectedTopicList(selectedListTopic);
  }

  function recommendationHandler() {
    console.log("allseltop: ", selectedTopicList);
    console.log("user skills: ", loadedSkills);
    console.log("user id: ", location.state.userid);
    navigate("/recommendedExercises", {
      state: {
        userId: location.state.userid,
        userSkills: loadedSkills,
        selectedTopics: selectedTopicList,
      },
    });
  }

  return (
    <div className="topicSelectContainer">
      <Header pageName="Oefenen op Nederlands" />
      <h2>Kies de onderwerpen waarvoor je wilt oefenen</h2>
      <div className="topicList">{loadedContent}</div>

      <div className="recEx">
        <button onClick={recommendationHandler}>Oefeningen aanbevelen</button>
      </div>
    </div>
  );
}

export default TopicSelectionPage;
