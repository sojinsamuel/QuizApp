import React, { useState } from "react";
import { decode } from "html-entities";
import Confetti from "react-confetti";

export default function Quizzical(props) {
  const [ansChecked, setAnsChecked] = useState(false);
  const { data: results, setNextQuiz, setIsLoading } = props;

  const quizez = results.map((result, index) => {
    let options = [result.correct_answer, ...result.incorrect_answers].sort();
    return (
      <div className={`${index ? "add-blur" : ""}`} key={index}>
        <div className="quiz-question">
          <p className="question">{decode(result.question)}</p>
        </div>
        <div className="quiz-options">
          <button
            className={`option-1 options row-${index}`}
            onClick={handleSelectClick}
          >
            {decode(options[0])}
          </button>
          <button
            className={`option-2 options row-${index}`}
            onClick={handleSelectClick}
          >
            {decode(options[1])}
          </button>
          <button
            className={`option-3 options row-${index}`}
            onClick={handleSelectClick}
          >
            {decode(options[2])}
          </button>
          <button
            className={`option-4 options row-${index}`}
            onClick={handleSelectClick}
          >
            {decode(options[3])}
          </button>
        </div>
      </div>
    );
  });

  let row = 0,
    progress = 0;
  function handleSelectClick(event) {
    const options = document.querySelectorAll(`.row-${row}`);
    const progressBar = document.querySelector(".progress");
    event.target.classList.add("selected");
    progressBar.style.width = `${(progress += 20)}%`;
    options.forEach((option) => {
      if (option.classList.contains("selected")) {
        option.style.pointerEvents = "none";
      } else {
        option.disabled = "false";
      }
    });
    row++;
    // picks up the first container with class "add-blur"
    const blurContainer = document.querySelector(".add-blur");
    // becomes false after the last blur container, since after the last "blurContainer", returns null
    if (blurContainer) {
      blurContainer.classList.remove("add-blur");
      document.querySelector(".selected").style.pointerEvents = "none";
    }
  }

  function handleAnsclick() {
    // only perfrom the below operations if the last question is selected
    if (document.querySelector(`.selected.row-4`)) {
      for (let i = 0; i < row; i++) {
        let options = document.querySelectorAll(`.row-${i}`);
        options.forEach((option) => {
          if (option.classList.contains("selected")) {
            if (option.textContent !== results[i].correct_answer) {
              option.classList.add("wrong");
            }
          }
          if (option.textContent === results[i].correct_answer) {
            option.classList.add("correct");
          }
          option.disabled = false;
          option.style.pointerEvents = "none";
        }); // forEach
      } // for loop
      setAnsChecked((prevState) => !prevState);
    } // if
  } // function

  function handleTryAgainclick() {
    setIsLoading(true);
    setAnsChecked((prevState) => !prevState);
    document.querySelectorAll(".options").forEach((btn) => {
      btn.classList.remove("correct", "wrong", "selected");
      btn.disabled = false;
      btn.style.pointerEvents = "initial";
    });
    setNextQuiz((prevState) => !prevState);
    document.body.scrollTop = 0; // for safari
    document.documentElement.scrollTop = 0;
  }

  let score = 0;
  if (ansChecked) {
    score = document.querySelectorAll(".selected.correct").length;
    if (score >= 4) {
      document.documentElement.scrollTop = 0;
    }
  }

  return (
    <React.Fragment>
      <div className="progress"></div>
      <div className="quiz-container">
        {score >= 4 && <Confetti className="winner" />}
        <div className="quiz-component">
          {quizez}
          {!ansChecked && (
            <button className="check-ans" onClick={handleAnsclick}>
              check answer
            </button>
          )}
          <div className="bottom-container">
            {ansChecked && (
              <p className="total-score">
                You scored {score}/5 correct answers
              </p>
            )}
            {ansChecked && (
              <button className="check-ans" onClick={handleTryAgainclick}>
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
