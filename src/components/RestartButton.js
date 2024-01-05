import { useQuizProvider } from "../hooks/useQuizProvider";

function RestartButton() {
  const { dispatch, fetchData } = useQuizProvider();

  return (
    <button
      className="btn btn-ui"
      onClick={() => {
        dispatch({ type: "restart" });
        fetchData();
      }}
    >
      Restart Quiz
    </button>
  );
}

export default RestartButton;
