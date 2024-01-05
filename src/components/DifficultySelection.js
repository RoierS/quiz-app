import { useQuizProvider } from "../hooks/useQuizProvider";

function DifficultySelection() {
  const { dispatch } = useQuizProvider();

  return (
    <div className="difficulty">
      <h4>Select the difficulty:</h4>
      <div className="selectWrapper">
        <select
          defaultValue="all"
          className="btn btn-ui"
          onChange={(e) =>
            dispatch({ type: "selectDifficulty", payload: e.target.value })
          }
        >
          <option value="all">All</option>
          <option value="easy">Easy 💪</option>
          <option value="medium">Medium 💪💪</option>
          <option value="hard">Hard 💪💪💪</option>
        </select>
      </div>
    </div>
  );
}

export default DifficultySelection;
