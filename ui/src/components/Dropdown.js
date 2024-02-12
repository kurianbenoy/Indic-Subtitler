const Dropdown = ({ label, options = [], onChange }) => {
  const handleSelectChange = (event) => {
    const selectedIndex = event.target.selectedIndex;
    const selectedItem = options[selectedIndex - 1];
    onChange(selectedItem);
  };

  return (
    <div className="p-2">
      <label className="mr-3">{label}</label>
      <select
        className="select select-bordered w-full max-w-xs"
        onChange={handleSelectChange}
      >
        <option disabled selected>
          Select
        </option>
        {options?.map((option) => (
          <option key={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
