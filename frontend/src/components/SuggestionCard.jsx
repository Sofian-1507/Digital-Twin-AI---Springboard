function SuggestionCard({ sendMessage }) {
  const suggestions = [
    "How can I improve my study performance?",
    "Analyze my finance habits.",
    "How can I sleep better?",
    "Predict my CGPA.",
    "Suggest a daily routine.",
    "How can I improve my productivity?",
  ];

  return (
    <div className="suggestion-card">

      <h3>Suggested Questions</h3>

      <div className="suggestion-list">

        {suggestions.map((item) => (

          <button
            key={item}
            className="suggestion-btn"
            onClick={() =>
              sendMessage(item)
            }
          >
            {item}
          </button>

        ))}

      </div>

    </div>
  );
}

export default SuggestionCard;