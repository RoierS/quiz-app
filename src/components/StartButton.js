import { useQuizProvider } from "../hooks/useQuizProvider";

function StartButton() {
  const { dispatch } = useQuizProvider();

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
