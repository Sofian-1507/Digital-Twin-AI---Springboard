import { BarChart3, BookOpen, Wallet, HeartPulse, TrendingUp, Target } from "lucide-react";

function QuickActions({ sendMessage }) {
  const actions = [
    {
      icon: BarChart3,
      label: "Analyze My Progress",
      prompt: "Analyze my overall progress",
    },
    {
      icon: BookOpen,
      label: "Study Plan",
      prompt: "Generate a study plan",
    },
    {
      icon: Wallet,
      label: "Finance Tips",
      prompt: "Give me finance tips",
    },
    {
      icon: HeartPulse,
      label: "Health Advice",
      prompt: "Give me health advice",
    },
    {
      icon: TrendingUp,
      label: "Predict Future",
      prompt: "Predict my future performance",
    },
    {
      icon: Target,
      label: "Improve Productivity",
      prompt: "How can I improve productivity?",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

      {actions.map((item) => (

        <button
          key={item.label}
          className="flex flex-col items-center gap-2 rounded-2xl bg-white dark:bg-slate-800 p-4 text-center text-sm font-medium text-slate-600 dark:text-slate-400 shadow-sm transition-colors hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
          onClick={() => sendMessage(item.prompt)}
        >
          <item.icon size={20} strokeWidth={1.8} />
          {item.label}
        </button>

      ))}

    </div>
  );
}

export default QuickActions;
