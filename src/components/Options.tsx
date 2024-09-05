import { useOptions } from "../context/OptionsContext";

function Options() {
  const { options, setOptions } = useOptions();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptions({ [name]: value });
  };

  return (
    <form>
      <ul>
        <li>
          Angle Unit:
          <select name="angleUnit" value={options.angleUnit} onChange={handleChange}>
            <option value="degree">Degree</option>
            <option value="radian">Radian</option>
            <option value="gradian">Gradian</option>
          </select>
        </li>
        <li>
          Precision:
          <input
            type="number"
            name="precision"
            value={options.precision || ''}
            onChange={handleChange}
            min="0"
            max="10"
          />
        </li>
        <li>Theme: {options.theme}</li>
      </ul>
    </form>
  );
}

export default Options;