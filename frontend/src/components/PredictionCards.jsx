function PredictionCards({ predictions = [] }) {

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