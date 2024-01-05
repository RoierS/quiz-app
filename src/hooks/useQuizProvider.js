import { useContext } from "react";
import { QuizContext } from "../contexts/QuizContext";

export const useQuizProvider = () => {
  const context = useContext(QuizContext);

  if (context === undefined)
    throw new Error("QuizContext was used outside of the Provider");

  return context;
};
