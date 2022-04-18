import React, {Component} from 'react'
import Papa from 'papaparse'

const PROBLEM_ID = 0
const PROBLEM_NAME = 1
const DIFFICULTY = 2
const ANSWER = 3

// Student has 45 minutes to answer 15 questions. It's a game between student
// and computer. Student Gets 10 points for each correct answer. Computer gets a
// matrix pay off for the student.

// Students get +10 for right answers and +0 for wrong answers.
// v - 0
// j - 10
// r - 20
// c - 10

// difficulty on a scale of 0 to 1. 0 is very hard and 1 is very easy.

// Teacher points
// +: dv + (1 - d)j
// -: dr + (1 - c)c

// Hypothesis is that if we can appropriately queue challenges than we should
// know where the student is at in terms of their ability. But it all comes down
// the agent's question selection strategy.

// Agent gets nothing if they answer an easy question right
// Agent gets a lot if they answer an easy question wrong
// Agent gets a fair amount of they answer a hard question right
// Agent gets a fair amount of they answer a hard question wrong

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answerChoice: "",
      questions: [],
      questionIndex: 52,
      studentScore: 0,
      agentScore: 0,
      questionsRemaining: 15,
    };
    this.onRadioOptionChange = this.onRadioOptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.v_score = 0
    this.j_score = 10
    this.r_score = 20
    this.c_score = 10
    this.seen_questions = []
  }

  onRadioOptionChange = (event) => {
    this.setState({
      answerChoice: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const userAnswer = this.state.answerChoice
    const correctAnswer = this.getCurrentQuestion()[ANSWER]
    const difficulty = this.getDifficulty()
    const wasStudentCorrect = userAnswer === correctAnswer
    const studentReward = wasStudentCorrect ? 10 : 0
    const teacherReward = wasStudentCorrect ?
        difficulty * this.v_score + (1 - difficulty) * this.j_score :
        difficulty * this.r_score + (1 - difficulty) * this.c_score

    this.setState({
      answerChoice: "",
      questionsRemaining: this.state.questionsRemaining - 1,
      studentScore: this.state.studentScore + studentReward,
      agentScore: this.state.agentScore + teacherReward,
      questionIndex: this.getNextQuestion(wasStudentCorrect)
    }, () => this.maybeTerminateAssessment())
  }

  getNextQuestion = (wasStudentCorrect) => {
    this.seen_questions.push(this.state.questionIndex)
    // if the student was right
    //  and the question was hard - get slightly harder
    //  and the question was easy - pick a much harder question
    // if the student was wrong
    //  and the question was hard - get slightly easier 
    //  and the question was easy - get slightly easier
    const numQuestionsAnsweredCorrectly = this.state.studentScore / 10 
    const numQuestionsAnswered = 15 - this.state.questionsRemaining 
    const pct = numQuestionsAnsweredCorrectly / numQuestionsAnswered

    // If this is negative the agent is losing
    // If this is positive the agent is winning
    const gameDiff = this.state.agentScore - this.state.studentScore

    if (wasStudentCorrect) {
      let nextQuestion = this.state.questionIndex + 3
      while (this.seen_questions.includes(nextQuestion)) {
        nextQuestion++;
      }
      return nextQuestion
    } else {
      let nextQuestion = this.state.questionIndex - 3
      while (this.seen_questions.includes(nextQuestion)) {
        nextQuestion--;
      }
      return nextQuestion;
    }
  }

  maybeTerminateAssessment() {
    if (this.state.questionsRemaining <= 0) {
      alert("The assessment is over. Your final score is: " + this.state.questionIndex)
    }
  }

  componentWillMount() {
    this.getCsvData();
  }

  async getCsvData() {
    let csvData = await this.fetchCsv();

    Papa.parse(csvData, {
      complete: this.getData
    });
  }

  fetchCsv() {
    return fetch('/questions.csv').then(function (response) {
      let reader = response.body.getReader();
      let decoder = new TextDecoder('utf-8');

      return reader.read().then(function (result) {
        return decoder.decode(result.value);
      });
    });
  }

  getData = (result) => {
    // Removes header from CSV file
    result.data.shift()
    this.setState({
      questions: result.data
    });
  }

  getCurrentQuestion() {
    const questionIndex = this.state.questionIndex;
    if (questionIndex === -1) {
      return null;
    }
    return this.state.questions[this.state.questionIndex];
  }

  getDifficulty() {
    const normalizedScore =
      this.state.questionIndex / (this.state.questions.length - 1)
    return 1 - normalizedScore
  }

  getImageSource() {
    if (this.getCurrentQuestion() == null) {
      return ""
    }
    return process.env.PUBLIC_URL +
        '/Questions/' + this.getCurrentQuestion()[PROBLEM_ID] + '.jpg'
  }
  
  render() {
      return (
        <div>
          <img src={this.getImageSource()} alt="2015-A-1" />
          <p>Select an answer choice below:</p>
          <form onSubmit={this.handleSubmit}>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="A"
                  checked={this.state.answerChoice === "A"}
                  onChange={this.onRadioOptionChange}
                />
                 A
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="B"
                  checked={this.state.answerChoice === "B"}
                  onChange={this.onRadioOptionChange}
                />
                B
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="C"
                  checked={this.state.answerChoice === "C"}
                  onChange={this.onRadioOptionChange}
                />
                C
              </label>
            </div>
            <div className="radio">
              <label>
                <input
                  type="radio"
                  value="D"
                  checked={this.state.answerChoice === "D"}
                  onChange={this.onRadioOptionChange}
                />
                D
              </label>
            </div>
            <button className="btn btn-default" type="submit">
              Submit
            </button>
          </form>
        </div>
      )
      
  }
}

export default Questions