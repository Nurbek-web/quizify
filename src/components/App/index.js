import React, { useState } from "react";
import axios from "axios";

import Layout from "../Layout";
import Loader from "../Loader";
import Main from "../Main";
import Quiz from "../Quiz";
import Result from "../Result";

import { shuffle } from "../../utils";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(null);
  const [data, setData] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [studyMaterial, setStudyMaterial] = useState("");
  const [qtype, setQtype] = useState("");
  const [feedback, setFeedback] = useState("");

  const startQuiz = (data, countdownTime, material, questionType) => {
    setLoa  ding(true);
    setLoadingMessage({
      title: "Loading your quiz...",
      message: "It won't be long!",
    });
    setCountdownTime(countdownTime);
    setStudyMaterial(material);
    setQtype(questionType);

    setTimeout(() => {
      setData(data);
      setIsQuizStarted(true);
      setLoading(false);
    }, 1000);
  };

  async function endQuiz(resultData) {
    setLoading(true);
    setLoadingMessage({
      title: "Fetching your results...",
      message: "Just a moment!",
    });

    if (resultData.questionType == "string") {
      const API = `https://openaiapi-n48x.onrender.com/api/`;

      let input =
        `
        Analyze questions and answers given by student based on the given study material. Check student's answers for open-ended questions:
        ${studyMaterial}` +
        resultData.questionsAndAnswers
          .map(
            (item) =>
              `{question:${item.question}, student_answer: ${item.user_answer}}\n`
          )
          .join("\n") +
        `
        The response format in the provided JSON structure is designed to convey information about multiple-choice questions in a clear and organized manner. Here's a justification for each key-value pair in the response:
  
        overallFeedback:
        Type: String
        Justification: Give overall feedback to student.

        totalQuestions:
        Type: Number
        Justification: Number of questions total.
        
        correctAnswers:
        Type: Number
        Justification: Number of correct answers of student.
        
        questionsAndAnswers:
        Type: Array of objects
        Justification: Each object in the array represents a separate question, user_answer, correct_answer, point.
        
        question:
        Type: String
        Justification: Contains the actual question text.
        
        user_answer:
        Type: String
        Justification: Student's actual answer for question 
  
        correct_answer:
        Type: String
        Justification: Correct answer to the question. This allows users to compare their responses and determine correctness. It's crucial for evaluating the user's knowledge.
  
        point:
        Type: Number
        Justification: If the answer of student is correct, point is equal to 1. Otherwise, it equals to 0. 


      `;

      const result = await axios.post(API, { message: input });
      console.log(result);
      const parsedResponse = JSON.parse(result.data.results);
      let results = parsedResponse;
      console.log(results);
      results.timeTaken = resultData.timeTaken;
      setFeedback(results.overallFeedback);

      setTimeout(() => {
        setIsQuizStarted(false);
        setIsQuizCompleted(true);
        setResultData(results);
        setLoading(false);
      }, 2000);
    } else {
      setTimeout(() => {
        setIsQuizStarted(false);
        setIsQuizCompleted(true);
        setResultData(resultData);
        setLoading(false);
      }, 2000);
    }
  }

  const replayQuiz = () => {
    setLoading(true);
    setLoadingMessage({
      title: "Getting ready for round two.",
      message: "It won't take long!",
    });

    const shuffledData = shuffle(data);
    shuffledData.forEach((element) => {
      element.options = shuffle(element.options);
    });

    setData(shuffledData);

    setTimeout(() => {
      setIsQuizStarted(true);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setLoading(true);
    setLoadingMessage({
      title: "Loading the home screen.",
      message: "Thank you for playing!",
    });

    setTimeout(() => {
      setData(null);
      setCountdownTime(null);
      setIsQuizStarted(false);
      setIsQuizCompleted(false);
      setResultData(null);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout>
      {loading && <Loader {...loadingMessage} />}
      {!loading && !isQuizStarted && !isQuizCompleted && (
        <Main startQuiz={startQuiz} />
      )}
      {!loading && isQuizStarted && (
        <Quiz
          data={data}
          countdownTime={countdownTime}
          questionType={qtype}
          endQuiz={endQuiz}
        />
      )}
      {!loading && isQuizCompleted && (
        <Result
          {...resultData}
          feedback={feedback}
          replayQuiz={replayQuiz}
          resetQuiz={resetQuiz}
        />
      )}
    </Layout>
  );
};

export default App;
