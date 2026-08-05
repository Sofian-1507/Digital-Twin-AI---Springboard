import { memo } from "react";
import ProgressList from "./ui/ProgressList";

function SubjectProgress({ subjects = [] }) {
  const items = subjects.map((s) => ({ key: s.name, label: s.name, value: s.progress }));

  return (
    <ProgressList
      title="Subject Progress"
      items={items}
      emptyMessage="No subject data yet — log a study session to see progress here."
    />
  );
}

export default memo(SubjectProgress);
