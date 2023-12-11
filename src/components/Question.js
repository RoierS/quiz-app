function Question({ question, children }) {
  console.log(question);
  return (
    <div>
      <h4>{question.question}</h4>
      {children}
    </div>
  );
}

export default Question;
