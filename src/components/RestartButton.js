function RestartButton({ dispatch, restartQuiz }) {
  return (
    <button
      className="btn btn-ui"
      onClick={() => {
        dispatch({ type: "restart" });
        restartQuiz();
      }}
    >
      Restart Quiz
    </button>
  );
}

export default RestartButton;
