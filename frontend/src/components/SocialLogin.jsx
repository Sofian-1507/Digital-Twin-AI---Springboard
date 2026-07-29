function SocialLogin() {
  return (
    <div className="social-login">

      <div className="divider">

        <span>OR</span>

      </div>

      <button
        type="button"
        className="google-btn"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
        />

        Continue with Google

      </button>

      <button
        type="button"
        className="github-btn"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
          alt="GitHub"
        />

        Continue with GitHub

      </button>

    </div>
  );
}

export default SocialLogin;