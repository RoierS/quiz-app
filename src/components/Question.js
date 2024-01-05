import { useQuizProvider } from "../hooks/useQuizProvider";

function Question({ children }) {
  const { currentQuestion } = useQuizProvider();

  return (
    <div>
      <h4>{currentQuestion.question}</h4>
      {children}
    </div>
  );
}

export default Question;
