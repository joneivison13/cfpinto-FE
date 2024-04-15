import React from "react";

// import { Container } from './styles';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  data: { id: string; label: string }[];
  placeholder?: string;
  errors?: any;
}

const Select: React.FC<SelectProps> = ({
  data,
  label,
  placeholder,
  errors,
  ...props
}) => {
  return (
    <>
      <div className="">
        <label className="form-label fw-bold">{label}</label>
        <select
          {...props}
          className="form-select"
          id="floatingSelect"
          aria-label="Floating label select example"
        >
          {data.map((item) => (
            <option value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>
      {props.name && errors[props.name] && (
        <span className="text-danger mb-2">{errors[props.name]}</span>
      )}
    </>
  );
};

export default Select;
