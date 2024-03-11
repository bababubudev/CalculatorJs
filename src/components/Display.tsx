function Display() {
  return (
    <textarea
      name="screen-area"
      id="screen-area"
      className="display"
      cols={30}
      rows={10}
      readOnly
    >
      This is readonly text area.
    </textarea>
  );
}

export default Display;