import { useState } from "react";

import StudySummary from "../components/StudySummary";
import StudyForm from "../components/StudyForm";
import StudyChart from "../components/StudyChart";
import SubjectProgress from "../components/SubjectProgress";
import RecommendationCard from "../components/RecommendationCard";
import StudyTable from "../components/StudyTable";

import { studySessions } from "../data/studyData";

import "../styles/Study.css";

function Study() {
  const [sessions, setSessions] = useState(studySessions);

  function addSession(session) {
    setSessions([
      {
        id: Date.now(),
        ...session,
      },
      ...sessions,
    ]);
  }

  return (
    <div className="study-page">

      <h2>Study Dashboard</h2>

      <StudySummary sessions={sessions} />

      <StudyForm addSession={addSession} />

      <StudyChart />

      <SubjectProgress />

      <RecommendationCard />

      <StudyTable sessions={sessions} />

    </div>
  );
}

export default Study;