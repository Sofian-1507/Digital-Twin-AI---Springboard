
function RecommendationCard({ recommendation }) {

  if (!recommendation) {
    return null;
  }

  return (
    <div className="recommendation-card">

      <div className="recommendation-header">

        <span className="recommendation-icon">
          🤖
        </span>

        <div>
          <h3>AI Recommendation</h3>

          <p>
            Based on your simulated future outcomes
          </p>
        </div>

      </div>


      <div className="recommendation-content">

        <h4>
          {recommendation.recommendation}
        </h4>

        <p>
          {recommendation.reason}
        </p>


        <div className="recommendation-stats">

          <div>

            <span>
              Expected Future Saving
            </span>

            <strong>
              ₹
              {recommendation.expected_future_saving?.toLocaleString()}
            </strong>

          </div>


          <div>

            <span>
              Expected Improvement
            </span>

            <strong>
              +₹
              {recommendation.expected_improvement?.toLocaleString()}
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RecommendationCard;
