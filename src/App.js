import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Options from "./components/Options";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";

const initialState = {
  questions: [],

  // 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",

  // current question
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "start":
      return { ...state, status: "active" };

    case "newAnswer":
      const currentQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === currentQuestion.correctOption
            ? state.points + currentQuestion.points
            : state.points,
      };

    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, initialState);

  const questionsAmount = questions.length;
  const totalPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen questionsAmount={questionsAmount} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              questionsAmount={questionsAmount}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question question={questions[index]}>
              <Options
                question={questions[index]}
                dispatch={dispatch}
                answer={answer}
              />
            </Question>
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              questionsAmount={questionsAmount}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            dispatch={dispatch}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
