import Header from "../components/header";
import LoadingSpinner from "../components/loadingSpinner";
import React, { useState, useEffect } from "react";
import RecommendationList from "../components/recommendationList";
import "./RecommendationExplanation.css";
import WaaromGraph from "../components/waaromGraph";
import { useLocation } from "react-router-dom";
import WhatifGraph from "../components/whatifGraph";
import { useNavigate } from "react-router-dom";
import WaaromList from "../components/waaromList";
import WatalsList from "../components/watalsList";

function RecommendationExplanation() {
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(true);
  const [loadedRecommendations, setLoadedRecommendations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoadingRecommendations(true);
    fetch(
      `http://127.0.0.1:5000/get_recommendations?uid=${encodeURIComponent(
        location.state.userId
      )}&uskills=${encodeURIComponent(
        JSON.stringify(location.state.userSkills)
      )}&selectedTopics=${encodeURIComponent(
        JSON.stringify(location.state.selectedTopics)
      )}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("rec data: ", data);
        setIsLoadingRecommendations(false);
        setLoadedRecommendations(data);
      });
  }, []);

  const location = useLocation();

  if (isLoadingRecommendations) {
    return <LoadingSpinner pageName="Aanbevolen oefeningen" />;
  }

  function reeksHandler() {
    navigate("/makeExercises");
  }

  return (
    <div className="main-container">
      <Header pageName="Aanbevolen oefeningen" />

      <div className="pageWrapper">
        <div className="rec-expl-container">
          <RecommendationList
            recEx={loadedRecommendations.recommended_exercises}
          />
          <div>
            <div className="rec-expl-title rec-expl-title-border-right">
              <h1>Uitleg</h1>
            </div>
            <div className="expl-container">
              <WaaromList data={loadedRecommendations.waarom_data}></WaaromList>
              <WatalsList data={loadedRecommendations.waarom_data}></WatalsList>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecommendationExplanation;

//<div className="recEx">
//  <button onClick={reeksHandler}>Maak reeks!</button>
//</div>;
