import { useMemo } from "react";
import { useEffect } from "react";

export default function Dropdown({
  label,
  options = [],
  onChange,
  selectedVal,
  defaultOption,
}) {
  const handleSelectChange = (event) => {
    const value = event.target.value;
    onChange(value);
  };
  const isOptionValid = options.find((option) => option.id === selectedVal);

  useEffect(() => {
    if (!isOptionValid) {
      onChange(options[0]?.id);
    } else {
      onChange(selectedVal);
    }
  }, [isOptionValid]);

  return (
    <div className="flex flex-col ">
      <label className="font-medium text-wrap my-0">{label}:</label>
      <p className=" text-xs text-red-700 mt-[-5px]">Required</p>

      <select
        aria-label="Select Target Language"
        onChange={handleSelectChange}
        className="mt-1 border-2 w-full text-lg px-2 py-2 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-300 transition-all transition-75"
        value={isOptionValid ? selectedVal : options[0]?.id}
      >
        <option value="">{defaultOption}</option>

        {options?.map((element, index) => (
          <option id={element.id} value={element.id} key={index}>
            {element.name}
          </option>
        ))}
      </select>
    </div>
  );
}
