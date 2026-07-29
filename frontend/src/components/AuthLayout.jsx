import "../styles/Auth.css";

function AuthLayout({
  title,
  subtitle,
  children,
}) {
  return (
    <div className="auth-container">

      <div className="auth-left">

        <div className="overlay">

          <h1>Digital Twin AI</h1>

          <p>
            AI-powered personal assistant
            for Finance, Study, Habits,
            and Future Prediction.
          </p>

        </div>

      </div>

      <div className="auth-right">

        <div className="auth-card">

          <h2>{title}</h2>

          <p>{subtitle}</p>

          {children}

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;