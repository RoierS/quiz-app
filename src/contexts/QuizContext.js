import { createContext, useEffect, useReducer } from "react";

const SECS_PER_QUESTION = 30;
const BASE_URL = process.env.REACT_APP_BASE_URL;

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

export const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const currentQuestion = questions[index];

  const questionsAmount = questions.length;

  const totalPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/questions`);
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
        const res = await fetch(`${BASE_URL}/highscore`);
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
        await fetch(`${BASE_URL}/highscore`, {
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
    <QuizContext.Provider
      value={{
        currentQuestion,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        questionsAmount,
        totalPoints,
        dispatch,
        fetchData,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizProvider;
