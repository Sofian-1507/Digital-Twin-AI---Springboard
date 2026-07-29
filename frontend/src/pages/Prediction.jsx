import { useState } from "react";

import PredictionSummary from "../components/PredictionSummary";
import PredictionCards from "../components/PredictionCards";
import FutureChart from "../components/FutureChart";
import SimulationForm from "../components/SimulationForm";
import AIInsights from "../components/AIInsights";
import PredictionHistory from "../components/PredictionHistory";

import {
  predictionHistory
} from "../data/predictionData";

import "../styles/Prediction.css";

function Prediction() {

  const [history, setHistory] =
    useState(predictionHistory);

  return (

    <div className="prediction-page">

      <h2>AI Prediction Dashboard</h2>

      <PredictionSummary history={history} />

      <PredictionCards />

      <FutureChart />

      <SimulationForm />

      <AIInsights />

      <PredictionHistory history={history} />

    </div>

  );

}

export default Prediction;