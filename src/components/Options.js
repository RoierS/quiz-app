function Options({ question, answer, dispatch }) {
  return (
    <div className="options">
      {question.options.map((option, i) => (
        <button
          className={`btn btn-option ${i === answer ? "answer" : ""} ${
            answer ? (i === question.correctOption ? "correct" : "wrong") : ""
          }`}
          key={option}
          disabled={answer}
          onClick={() => dispatch({ type: "newAnswer", payload: i })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
