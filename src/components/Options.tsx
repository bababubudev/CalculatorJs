import { useOptions } from "../context/OptionsContext";

function Options() {
  const { options, setOptions } = useOptions();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptions({ [name]: value });
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
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
          <select name="precision" value={options.precision} onChange={handleChange}>
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </li>
        <li>Theme: {options.theme}</li>
      </ul>
    </form >
  );
}

export default Options;