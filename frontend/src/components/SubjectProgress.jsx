function SubjectProgress({ subjects = [] }) {

  return (
    <div className="subject-card">

      <h3>Subject Progress</h3>

      {subjects.map((subject) => (

        <div
          key={subject.name}
          className="subject-item"
        >

          <div className="subject-header">

            <span>{subject.name}</span>

            <span>{subject.progress}%</span>

          </div>

          <div className="subject-progress">

            <div
              className="subject-fill"
              style={{
                width: `${subject.progress}%`,
              }}
            ></div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default SubjectProgress;