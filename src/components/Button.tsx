interface ButtonProps {
  name?: string;
  onButtonPressed: () => void;
}

function Button(props: ButtonProps) {
  const { name, onButtonPressed } = props;

  return (
    <button
      type="button"
      className="button"
      onClick={onButtonPressed}
    >
      <span>{name}</span>
    </button>
  );
}

export default Button;