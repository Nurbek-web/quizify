import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Segment,
  Item,
  Dropdown,
  Divider,
  Button,
  Message,
  TextArea,
} from "semantic-ui-react";

import axios from "axios";

import {
  CATEGORIES,
  NUM_OF_QUESTIONS,
  DIFFICULTY,
  QUESTIONS_TYPE,
  COUNTDOWN_TIME,
} from "../../constants";
import { shuffle } from "../../utils";

import Offline from "../Offline";

const Main = ({ startQuiz }) => {
  const [category, setCategory] = useState("0");
  const [numOfQuestions, setNumOfQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");
  const [questionsType, setQuestionsType] = useState("0");
  const [countdownTime, setCountdownTime] = useState({
    hours: 0,
    minutes: 120,
    seconds: 0,
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);
  const [material, setMaterial] = useState(""); // Add state for player name

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

  let allFieldsSelected = false;
  if (
    category &&
    numOfQuestions &&
    difficulty &&
    questionsType &&
    (countdownTime.hours || countdownTime.minutes || countdownTime.seconds)
  ) {
    allFieldsSelected = true;
  }

  async function fetchData() {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://openaiapi-n48x.onrender.com/api/`;

    const input = `
      Generate open-ended questions based on the given study material. Open-ended questions start with “Why?” “How?” and “What?” They encourage a full answer, rather than the simple “yes” or “no” response that is usually given to a closed-ended question:
      ${material}

      Diffuculty of quiz: ${difficulty}
      Number of questions: ${numOfQuestions}

      The response format in the provided JSON structure is designed to convey information about multiple-choice questions in a clear and organized manner. Here's a justification for each key-value pair in the response:

      results:
      Type: Array of objects
      Justification: The array allows for multiple questions and their associated details to be included in the response. Each object in the array represents a separate question.
      
      difficulty:
      Type: String
      Justification: Provides information about the difficulty level of the question. This can help users understand the complexity of the question and can be used for sorting or categorization.
      
      question:
      Type: String
      Justification: Contains the actual question text. This is the core information being sought, and it needs to be presented clearly for users to read and understand.
      
      correct_answer:
      Type: String
      Justification: Provides the correct answer to the question. This allows users to compare their responses and determine correctness. It's crucial for evaluating the user's knowledge.
      
    `;

    const result = await axios.post(API, { message: input });
    // setResponse();
    console.log(result);
    const parsedResponse = JSON.parse(result.data.results);
    let results = parsedResponse.results;

    setProcessing(false);
    startQuiz(
      results,
      countdownTime.hours + countdownTime.minutes + countdownTime.seconds,
      material
    );

    // fetch(API)
    //   .then((respone) => respone.json())
    //   .then((data) =>
    //     setTimeout(() => {
    //       const { response_code, results } = data;

    //       if (response_code === 1) {
    //         const message = (
    //           <p>
    //             The API doesn't have enough questions for your query. (Ex.
    //             Asking for 50 Questions in a Category that only has 20.)
    //             <br />
    //             <br />
    //             Please change the <strong>No. of Questions</strong>,{" "}
    //             <strong>Difficulty Level</strong>, or{" "}
    //             <strong>Type of Questions</strong>.
    //           </p>
    //         );

    //         setProcessing(false);
    //         setError({ message });

    //         return;
    //       }

    //       results.forEach((element) => {
    //         element.options = shuffle([
    //           element.correct_answer,
    //           ...element.incorrect_answers,
    //         ]);
    //       });

    //       setProcessing(false);
    //       startQuiz(
    //         results,
    //         countdownTime.hours + countdownTime.minutes + countdownTime.seconds
    //       );
    //     }, 1000)
    //   )
    //   .catch((error) =>
    //     setTimeout(() => {
    //       if (!navigator.onLine) {
    //         setOffline(true);
    //       } else {
    //         setProcessing(false);
    //         setError(error);
    //       }
    //     }, 1000)
    //   );
  }

  if (offline) return <Offline />;

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Image
              src={
                "https://almaty.fizmat.kz/wp-content/uploads/sites/2/2017/03/NIS-Photo.jpg"
              }
            />
            <Item.Content>
              <Item.Header>
                <h1>AUTO Quiz</h1>
              </Item.Header>
              {error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )}
              <Divider />
              <Item.Meta>
                <p>How many questions do you want in your quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="numOfQ"
                  placeholder="Select No. of Questions"
                  header="Select No. of Questions"
                  options={NUM_OF_QUESTIONS}
                  value={numOfQuestions}
                  onChange={(e, { value }) => setNumOfQuestions(value)}
                  disabled={processing}
                />
                <br />
                <p>How difficult do you want your quiz to be?</p>
                <Dropdown
                  fluid
                  selection
                  name="difficulty"
                  placeholder="Select Difficulty Level"
                  header="Select Difficulty Level"
                  options={DIFFICULTY}
                  value={difficulty}
                  onChange={(e, { value }) => setDifficulty(value)}
                  disabled={processing}
                />
                <br />
                {/* <p>Which type of questions do you want in your quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="type"
                  placeholder="Select Questions Type"
                  header="Select Questions Type"
                  options={QUESTIONS_TYPE}
                  value={questionsType}
                  onChange={(e, { value }) => setQuestionsType(value)}
                  disabled={processing}
                />
                <br /> */}
                <p>Please select the countdown time for your quiz.</p>
                <Dropdown
                  search
                  selection
                  name="hours"
                  placeholder="Select Hours"
                  header="Select Hours"
                  options={COUNTDOWN_TIME.hours}
                  value={countdownTime.hours}
                  onChange={handleTimeChange}
                  disabled={processing}
                />
                <Dropdown
                  search
                  selection
                  name="minutes"
                  placeholder="Select Minutes"
                  header="Select Minutes"
                  options={COUNTDOWN_TIME.minutes}
                  value={countdownTime.minutes}
                  onChange={handleTimeChange}
                  disabled={processing}
                />
                <Dropdown
                  search
                  selection
                  name="seconds"
                  placeholder="Select Seconds"
                  header="Select Seconds"
                  options={COUNTDOWN_TIME.seconds}
                  value={countdownTime.seconds}
                  onChange={handleTimeChange}
                  disabled={processing}
                />
              </Item.Meta>
              <Item.Meta>
                {/* ... (existing code) */}
                <br />
                <p>Give a study material</p>
                <TextArea
                  style={{ width: "100%" }} // Adjust the min height, font size, and width as needed
                  placeholder="Enter your study material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  disabled={processing}
                  rows={5} // Set the number of visible rows
                />

                {/* ... (existing code) */}
              </Item.Meta>

              <Divider />
              <Item.Extra>
                <Button
                  primary
                  size="big"
                  icon="play"
                  labelPosition="left"
                  content={processing ? "Processing..." : "Play Now"}
                  onClick={fetchData}
                  disabled={!allFieldsSelected || processing}
                />
              </Item.Extra>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <br />
    </Container>
  );
};

Main.propTypes = {
  startQuiz: PropTypes.func.isRequired,
};

export default Main;
