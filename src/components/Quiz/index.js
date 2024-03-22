import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Container,
  Segment,
  Item,
  Divider,
  Button,
  Icon,
  Message,
  Menu,
  Header,
  Input,
} from "semantic-ui-react";
import he from "he";

import Countdown from "../Countdown";
import { getLetter } from "../../utils";

const Quiz = ({ data, countdownTime, endQuiz }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [userSlectedAns, setUserSlectedAns] = useState(null);
  const [questionsAndAnswers, setQuestionsAndAnswers] = useState([]);
  const [timeTaken, setTimeTaken] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    if (questionIndex > 0) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [questionIndex]);

  const handleItemClick = (e, { name }) => {
    setUserSlectedAns(name);
  };

  const handleNext = () => {
    let point = 0;
    if (userSlectedAns === he.decode(data[questionIndex].correct_answer)) {
      point = 1;
    }

    const qna = questionsAndAnswers;
    qna.push({
      question: he.decode(data[questionIndex].question),
      user_answer: userAnswer,
      correct_answer: he.decode(data[questionIndex].correct_answer),
    });

    setUserAnswer("");

    if (questionIndex === data.length - 1) {
      return endQuiz({
        totalQuestions: data.length,
        timeTaken,
        questionsAndAnswers: qna,
      });
    }

    setCorrectAnswers(correctAnswers + point);
    setQuestionIndex(questionIndex + 1);
    setUserSlectedAns(null);
    setQuestionsAndAnswers(qna);
  };

  const timeOver = (timeTaken) => {
    return endQuiz({
      totalQuestions: data.length,
      correctAnswers,
      timeTaken,
      questionsAndAnswers,
    });
  };

  return (
    <Item.Header>
      <Container>
        <Segment>
          <Item.Group divided>
            <Item>
              <Item.Content>
                <Item.Extra>
                  <Header as="h1" block floated="left">
                    <Icon name="info circle" />
                    <Header.Content>
                      {`Question No.${questionIndex + 1} of ${data.length}`}
                    </Header.Content>
                  </Header>
                  <Countdown
                    countdownTime={countdownTime}
                    timeOver={timeOver}
                    setTimeTaken={setTimeTaken}
                  />
                </Item.Extra>
                <br />

                <Item.Meta>
                  <Message size="huge" floating>
                    <b>{`Q. ${he.decode(data[questionIndex].question)}`}</b>
                  </Message>
                  <br />
                  <Item.Description>
                    <h3>Please type your answer:</h3>
                    <Input
                      fluid
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                    />
                  </Item.Description>
                </Item.Meta>

                <Divider />
                <Item.Extra>
                  <Button
                    primary
                    content="Next"
                    onClick={handleNext}
                    floated="right"
                    size="big"
                    icon="right chevron"
                    labelPosition="right"
                    disabled={userAnswer == ""}
                  />
                </Item.Extra>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
        <br />
      </Container>
    </Item.Header>
  );
};

Quiz.propTypes = {
  data: PropTypes.array.isRequired,
  countdownTime: PropTypes.number.isRequired,
  endQuiz: PropTypes.func.isRequired,
};

export default Quiz;
