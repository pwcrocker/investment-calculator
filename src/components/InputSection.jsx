
import { useEffect } from "react";
import NumberInput from "./NumberInput";

// I'm taking an onChange handler function from parent so that parent maintains control over
//   its own state, which is also imported here in investParams
// again, i think this is an ok pattern but im not sure
// forms might be better but haven't used thos yet
const InputSection = ({ investParams, onChangeHandler, inputMetadata }) => {
  // effectively subscribe to changes in the investParams state obj from parent component,
  //  and re-render if changes are detected
  // this could be a terrible solution, idk
  useEffect(() => {}, [investParams]);

  return (
    <div id="user-input" className="input-group">
      {
        // use keys to enforce order (as of 2015: ES6)
        Object.keys(investParams).map((paramKey) => {
          const curInput = inputMetadata[paramKey];
          return (
            <div key={paramKey + "Div"}>
              <NumberInput id={paramKey} key={paramKey + "Input"} label={curInput.label} step={curInput.step} min={curInput.min} max={curInput.max}
                onChange={onChangeHandler} value={investParams[paramKey] === 0 ? '' : investParams[paramKey]} />
            </div>
          );
        })
      }
    </div>
  )
};

export default InputSection;
