function DifficultySelection({ dispatch }) {
  return (
    <div className="difficulty">
      <h4>Select the difficulty:</h4>
      <select
        defaultValue="all"
        className="btn btn-ui"
        onChange={(e) =>
          dispatch({ type: "selectDifficulty", payload: e.target.value })
        }
      >
        <option value="all">All</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>
  );
}

export default DifficultySelection;
