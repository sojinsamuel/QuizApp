import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Intro from "./components/Intro";
import Quizzical from "./components/Quizzical";
import Loader from "./components/Loader";

function App() {
  const [apiData, setApiData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextQuiz, setNextQuiz] = useState(false);
  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&type=multiple")
      .then((response) => response.json())
      .then((data) => {
        setApiData(data.results);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, [nextQuiz]);

  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/">
          <Intro />
        </Route>
        <Route path="/start-quiz">
          {isLoading ? (
            <Loader />
          ) : (
            <Quizzical
              data={apiData}
              setNextQuiz={setNextQuiz}
              setIsLoading={setIsLoading}
            />
          )}
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
