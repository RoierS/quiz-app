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
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import DifficultySelection from "./components/DifficultySelection";
import RestartButton from "./components/RestartButton";
import StartButton from "./components/StartButton";
import Highscore from "./components/Highscore";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],

  //possible statuses: 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",

  // current question
  index: 0,

  answer: null,
  points: 0,
  highscore: null,
  secondsRemaining: null,

  // difficulty selection
  all: [],
  easy: [],
  medium: [],
  hard: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        all: action.payload,
        easy: action.payload.filter((q) => q.points === 10),
        medium: action.payload.filter((q) => q.points === 20),
        hard: action.payload.filter((q) => q.points === 30),
      };
    case "highscoreReceived":
      return {
        ...state,
        status: "ready",
        highscore: action.payload,
      };

    case "dataFailed":
      return { ...state, status: "error" };

    case "selectDifficulty":
      return { ...state, questions: state[action.payload] };

    case "start":
      return {
        ...state,
        status: "active",

        // claculating time depends on questions amount
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

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
      const newHighscore =
        state.points > state.highscore ? state.points : state.highscore;

      return {
        ...state,
        status: "finished",
        highscore: newHighscore,
      };

    case "restart":
      return {
        ...initialState,
        questions: [],
        status: "loading",
        highscore: state.highscore,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highscore:
          state.secondsRemaining === 0
            ? Math.max(state.highscore, state.points)
            : state.highscore,
      };

    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const questionsAmount = questions.length;

  const totalPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:8000/questions");
      const data = await res.json();
      dispatch({ type: "dataReceived", payload: data });
    } catch (error) {
      dispatch({ type: "dataFailed" });
    }
  };

  // fetching guestions
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchHighscore = async () => {
      try {
        const res = await fetch("http://localhost:8000/highscore");
        const data = await res.json();
        dispatch({ type: "highscoreReceived", payload: data.highscore });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    };

    fetchHighscore();
  }, []);

  // posting the higsciore to API
  useEffect(() => {
    const postHighscore = async () => {
      try {
        await fetch("http://localhost:8000/highscore", {
          method: "POST",
          body: JSON.stringify({ highscore: highscore }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        dispatch({ type: "dataFailed" });
      }
    };

    if (status === "finished") {
      postHighscore();
    }
  }, [highscore, status]);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}

        {status === "error" && <Error />}

        {status === "ready" && (
          <StartScreen questionsAmount={questionsAmount} dispatch={dispatch}>
            <DifficultySelection questions={questions} dispatch={dispatch} />
            <Highscore highscore={highscore} />
            <StartButton dispatch={dispatch} />
          </StartScreen>
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

            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                questionsAmount={questionsAmount}
              />
            </Footer>
          </>
        )}

        {status === "finished" && (
          <FinishScreen
            points={points}
            totalPoints={totalPoints}
            highscore={highscore}
          >
            <RestartButton dispatch={dispatch} restartQuiz={fetchData} />
          </FinishScreen>
        )}
      </Main>
    </div>
  );
}

export default App;
