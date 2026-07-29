import { useState } from "react";

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {

  const [showPassword, setShowPassword] =
    useState(false);

  return (

    <div className="form-group">

      <label>{label}</label>

      <div className="password-box">

        <input
          type={
            showPassword
              ? "text"
              : "password"
          }
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required
        />

        <button
          type="button"
          className="eye-btn"
          onClick={() =>
            setShowPassword(
              !showPassword
            )
          }
        >
          {showPassword ? "🙈" : "👁"}
        </button>

      </div>

    </div>

  );
}

export default PasswordInput;