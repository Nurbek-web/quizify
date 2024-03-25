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
  const [material, setMaterial] = useState("");

  const handleTimeChange = (e, { name, value }) => {
    setCountdownTime({ ...countdownTime, [name]: value });
  };

  let allFieldsSelected = false;
  if (
    numOfQuestions &&
    difficulty &&
    (countdownTime.hours || countdownTime.minutes || countdownTime.seconds)
  ) {
    allFieldsSelected = true;
  }

  async function fetchData() {
    setProcessing(true);

    if (error) setError(null);

    const API = `https://openaiapi-n48x.onrender.com/api/`;

    let input;

    if (questionsType == "string") {
      input = `
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
      Justification: Provides the correct answer to the question. This allows users to compare their responses and determine correctness. It's crucial for evaluating the user's knowledge.`;
    } else {
      input = `
      Generate multiple-choice questions based on the given study material:
      ${material}

      Diffuculty of quiz: ${difficulty}
      Number of questions: ${numOfQuestions}

      The response format in the provided JSON structure is designed to convey information about multiple-choice questions in a clear and organized manner. Here's a justification for each key-value pair in the response:

      response_code:

      Type: Integer
      Justification: This code can be used to indicate the status or outcome of the request. A value of 0 typically signifies success, while other values could represent different types of responses (e.g., error codes).
      results:

      Type: Array of objects
      Justification: The array allows for multiple questions and their associated details to be included in the response. Each object in the array represents a separate question.
      type:

      Type: String
      Justification: Indicates the type of question format. In this case, "multiple" denotes a multiple-choice question. Other types like "true/false" or "open-ended" could be used for different question structures.
      difficulty:

      Type: String
      Justification: Provides information about the difficulty level of the question. This can help users understand the complexity of the question and can be used for sorting or categorization.
      category:

      Type: String
      Justification: Specifies the category or topic to which the question belongs. This helps users quickly identify the subject matter of the question.
      question:

      Type: String
      Justification: Contains the actual question text. This is the core information being sought, and it needs to be presented clearly for users to read and understand.
      correct_answer:

      Type: String
      Justification: Provides the correct answer to the question. This allows users to compare their responses and determine correctness. It's crucial for evaluating the user's knowledge.
      incorrect_answers:

      Type: Array of strings
      Justification: Lists the incorrect answer options for the multiple-choice question. This array allows for the presentation of distractors or alternatives, creating a complete set of options for the user.

    `;
    }

    const result = await axios.post(API, { message: input });
    console.log(result);
    const parsedResponse = JSON.parse(result.data.results);
    let results = parsedResponse.results;

    if (questionsType == "multiple") {
      results.forEach((element) => {
        element.options = shuffle([
          element.correct_answer,
          ...element.incorrect_answers,
        ]);
      });
    }

    setProcessing(false);
    startQuiz(
      results,
      countdownTime.hours + countdownTime.minutes + countdownTime.seconds,
      material,
      questionsType
    );
  }

  if (offline) return <Offline />;

  return (
    <Container>
      <Segment>
        <Item.Group divided>
          <Item>
            <Item.Content>
              {/* <Item.Header>
                <h1>AUTO Quiz</h1>
              </Item.Header> */}
              {error && (
                <Message error onDismiss={() => setError(null)}>
                  <Message.Header>Error!</Message.Header>
                  {error.message}
                </Message>
              )}
              {/* <Divider /> */}
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
                <p>Which type of questions do you want in your quiz?</p>
                <Dropdown
                  fluid
                  selection
                  name="type"
                  placeholder="Select Questions Type"
                  header="Select Questions Type"
                  options={QUESTIONS_TYPE}
                  value={questionsType}
                  onChange={(e, { value }) => {
                    setQuestionsType(value);
                    console.log(value);
                  }}
                  disabled={processing}
                />
                <br />
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
