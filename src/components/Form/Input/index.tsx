import React from "react";
import { useMask } from "@react-input/mask";

// import { Container } from './styles';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  type: React.HTMLInputTypeAttribute | undefined;
  image?: any;
  style: {
    container: string;
    input: string;
  };
  label?: string;
  mask?: "cpf" | "phone";
  errors?: any;
}

const Input: React.FC<InputProps> = ({
  image,
  placeholder,
  type,
  style,
  label,
  mask,
  errors,
  ...props
}) => {
  const cpfRef = useMask({
    mask: "___.___.___-__",
    replacement: { _: /\d/ },
  });
  const phoneRef = useMask({
    mask: "+55 (__) _____-____",
    replacement: { _: /\d/ },
  });

  return (
    <>
      <div className={style.container}>
        <div className="input-group d-flex">
          {label && <label className="form-label fw-bold">{label}</label>}
          <input
            {...props}
            type={type}
            className={`form-control ${image ? "border-end-0" : ""} ${
              style.input
            }`}
            style={{
              width: image ? "auto" : "100%",
              borderRadius: "var(--bs-border-radius)",
            }}
            placeholder={placeholder}
            ref={
              mask === "cpf" ? cpfRef : mask === "phone" ? phoneRef : undefined
            }
          />
          {image && (
            <div className="input-group-prepend">
              <span
                style={{ height: 38 }}
                className="input-group-text border-start-0 bg-white rounded-start-0"
                id="inputGroupPrepend3"
              >
                <img src={image} alt="icon" style={{ width: 16 }} />
              </span>
            </div>
          )}
        </div>
        {props.name && errors[props.name] && (
          <span className="text-danger">{errors[props.name]}</span>
        )}
      </div>
    </>
  );
};

export default Input;
