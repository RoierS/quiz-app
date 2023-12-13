function StartScreen({ questionsAmount, children }) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{questionsAmount} questions to test your React mastery</h3>

      {children}
    </div>
  );
}

export default StartScreen;
