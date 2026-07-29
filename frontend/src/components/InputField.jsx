function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = true,
}) {
  return (
    <div className="form-group">

      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />

    </div>
  );
}

export default InputField;