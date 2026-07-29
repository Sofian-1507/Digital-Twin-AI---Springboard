function PredictionCards() {

  const predictions = [
    {
      title: "Finance",
      current: 88,
      future: 94,
      color: "#4F46E5",
    },
    {
      title: "Study",
      current: 90,
      future: 96,
      color: "#2563EB",
    },
    {
      title: "Lifestyle",
      current: 86,
      future: 92,
      color: "#10B981",
    },
  ];

  return (
    <div className="prediction-cards">

      {predictions.map((item) => (

        <div
          key={item.title}
          className="prediction-info-card"
        >

          <h3
            style={{
              color: item.color,
            }}
          >
            {item.title}
          </h3>

          <p>
            Current Score :
            <strong> {item.current}%</strong>
          </p>

          <p>
            Future Prediction :
            <strong> {item.future}%</strong>
          </p>

          <div className="prediction-progress">

            <div
              className="prediction-fill"
              style={{
                width: `${item.future}%`,
                background: item.color,
              }}
            ></div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default PredictionCards;