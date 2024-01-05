import { useQuizProvider } from "../hooks/useQuizProvider";

function Progress() {
  const { index, questionsAmount, points, totalPoints, answer } =
    useQuizProvider();

  return (
    <header className="progress">
      <progress max={questionsAmount} value={index + Number(answer !== null)} />

      <p>
        Question <strong>{index + 1}</strong> / {questionsAmount}
      </p>

      <p>
        <strong>{points}</strong> / {totalPoints} points
      </p>
    </header>
  );
}

export default Progress;
