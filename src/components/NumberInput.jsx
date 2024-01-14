const NumberInput = ({ children, id, label, ...props }) => {
  return (
    <>
      <label>{label}</label>
      <input type="number" id={id} {...props}></input>
    </>
  )
};

export default NumberInput;
