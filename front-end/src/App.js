import logo from "./logo.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import TopicSelectionPage from "./pages/TopicSelection";
import UserSelectionPage from "./pages/UserSelection";
import RecommendationExplanation from "./pages/RecommendationExplanation";
import MakeSequence from "./pages/MakeSequence";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<TopicSelectionPage />}></Route>
        <Route path="/selectUser" element={<UserSelectionPage />}></Route>
        <Route
          path="/recommendedExercises"
          element={<RecommendationExplanation />}
        ></Route>
        <Route path="/makeSequence" element={<MakeSequence />}></Route>
      </Routes>
    </div>
  );
}

export default App;
