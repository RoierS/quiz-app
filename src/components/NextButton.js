import { useQuizProvider } from "../hooks/useQuizProvider";

function NextButton() {
  const { dispatch, answer, index, questionsAmount } = useQuizProvider();

  if (answer === null) return;

  if (index < questionsAmount - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === questionsAmount - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
