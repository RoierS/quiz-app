function Highscore({ highscore }) {
  return (
    <div className="score">
      <span className="highscore">Highscore:</span>{" "}
      {highscore > 0 ? `🔝  ${highscore}` : "Finish quiz to see highscore"}
    </div>
  );
}

export default Highscore;
