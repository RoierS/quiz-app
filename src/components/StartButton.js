function StartButton({ dispatch }) {
  return (
    <button
      onClick={() => {
        dispatch({ type: "start" });
      }}
      className="btn btn-ui"
    >
      Let's start
    </button>
  );
}

export default StartButton;
