import useLocalStorage from "@components/hooks/useLocalStorage";
import { useEffect } from "react";

export default function Dropdown({
  label,
  keyName,
  options = [],
  onChange,
  defaultOption,
  selectedModel,
}) {
  function Options(options) {
    console.log(options.option);
    const model = options.option.find((item) => item.model === selectedModel);
    return model.languages.map((lang, index) => (
      <option key={index} id={lang.id} value={lang.id}>
        {lang.name}
      </option>
    ));
  }
  const [selectedOption, setSelectedOption] = useLocalStorage(keyName, "");

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
  };
  useEffect(() => {
    onChange(selectedOption);
  }, [selectedOption]);

  return (
    <div className="flex flex-col">
      <label className="font-medium text-wrap">{label}:</label>
      <select
        onChange={handleSelectChange}
        className="mt-1 border-2 w-full text-lg px-2 py-2 rounded-md cursor-pointer focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-300 transition-all transition-75"
        value={selectedOption} // Set the value to the selectedOption
      >
        <option value="">{defaultOption}</option>

        {selectedModel ? (
          <Options option={options} />
        ) : (
          options?.map((element, index) => (
            <option id={element.id} value={element.id} key={index}>
              {element.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
