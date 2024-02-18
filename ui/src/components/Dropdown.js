import useLocalStorage from "@components/hooks/useLocalStorage";
import { useEffect } from "react";

export default function Dropdown({ label, keyName, options = [], onChange }) {
  const [selectedOption, setSelectedOption] = useLocalStorage(keyName, "");

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };
  useEffect(() => {
    onChange(selectedOption);
  }, [selectedOption]);

  return (
    <div className="flex flex-col xl:flex-row xl:items-center xl:gap-14 ">
      <label htmlFor="language-select" className="font-medium">
        {label}:
      </label>
      <select
        onChange={handleSelectChange}
        className="mt-1 border-2 w-full  text-lg px-2 py-2 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-300 transition-all transition-75"
        value={selectedOption} // Set the value to the selectedOption
      >
        <option value="">Select language</option>
        {options?.map((element) => (
          <option id={element.id} value={element.id} key={element.id}>
            {element.name}
          </option>
        ))}
      </select>
    </div>
  );
}
