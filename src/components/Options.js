import { useQuizProvider } from "../hooks/useQuizProvider";

function Options() {
  const { currentQuestion, answer, dispatch } = useQuizProvider();

  return (
    <div className="options">
      {currentQuestion.options.map((option, i) => (
        <button
          className={`btn btn-option ${i === answer ? "answer" : ""} ${
            answer !== null
              ? i === currentQuestion.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          key={option}
          disabled={answer !== null}
          onClick={() => dispatch({ type: "newAnswer", payload: i })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
