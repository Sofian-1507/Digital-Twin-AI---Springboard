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
    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Suggested Questions</h3>

      <div className="flex flex-wrap gap-2.5">

        {suggestions.map((item) => (

          <button
            key={item}
            className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-indigo-900"
            onClick={() => sendMessage(item)}
          >
            {item}
          </button>

        ))}

      </div>

    </div>
  );
}

export default SuggestionCard;
