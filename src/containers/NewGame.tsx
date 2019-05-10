import * as React from "react";
import { Redirect } from "react-router-dom";
import "../index.css";
import { Button } from "react-md/lib/Buttons";
import InputField from "react-md/lib/TextFields";
import { Grid, Cell } from "react-md";
import { DateRange } from "react-date-range";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const NEW_GAME_MUTATION = gql`
  mutation(
    $name: String!
    $words: [String!]!
    $availableFrom: DateTimeUtc!
    $availableTo: DateTimeUtc!
  ) {
    addGame(
      submission: {
        name: $name
        words: $words
        availableFrom: $availableFrom
        availableTo: $availableTo
      }
    ) {
      id
    }
  }
`;

const puzzleWordsLabel =
  "Words to place in the puzzle (separated by spaces). Words must " +
  "contain only lowercase letters of the english alphabet";

class NewGame extends React.Component {

  public props: any;
  public state = {
    name: "",
    words: [],
    invalidWords: null,
    availableRange: {
      startDate: new Date(),
      endDate: new Date(),
      key: "availability"
    },
    newGameId: null,
  };

  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleWordsChange = this.handleWordsChange.bind(this);
    this.hasError = this.hasError.bind(this);
    this.renderError = this.renderError.bind(this);
    this.handleAvialabilityChange = this.handleAvialabilityChange.bind(this);
  }

  private renderNewGame(addNewGame: (config: any) => any): React.ReactNode {
    let handleSubmit = (e) => this.handleSubmit(e, addNewGame);
    return (
      <form onSubmit={handleSubmit}>
        <Grid>
          <Cell size={6}>
            <InputField
              id="name"
              name="name"
              label="Name of the game"
              type="text"
              required={true}
              value={this.state.name}
              onChange={this.handleNameChange}
            />
          </Cell>
        </Grid>
        <Grid>
          <Cell size={6}>
            <DateRange
              ranges={[this.state.availableRange]}
              minDate={new Date() as any}
              onChange={this.handleAvialabilityChange}
            />
          </Cell>
        </Grid>
        <Grid>
          <Cell size={6}>
            <InputField
              id="words"
              type="text"
              required={true}
              onChange={this.handleWordsChange}
              label={puzzleWordsLabel}
              placeholder="Words to place in the puzzle"
            />
          </Cell>
        </Grid>
        {this.renderWords(this.state.words, this.state.invalidWords)}
        {this.renderError()}
        <Button
          type="submit"
          primary={true}
          raised={true}
          disabled={this.hasError()}
        >
          Submit
        </Button>
      </form>
    );
  }

  public render() {
    if (this.state.newGameId) {
        return <Redirect to={"/game/" + this.state.newGameId} />;
    }
    return (
      <Mutation mutation={NEW_GAME_MUTATION}>
        {addNewGame => this.renderNewGame(addNewGame)}
      </Mutation>
    );
  }

  public handleSubmit(event: any, addNewGame: any) {
    console.log(event, this, this.hasError());
    event.preventDefault();
    if (!this.hasError()) {
      addNewGame({
        variables: {
          name: this.state.name,
          words: this.state.words,
          availableFrom: this.state.availableRange.startDate,
          availableTo: this.state.availableRange.endDate
        }
      }).then(response => {
        this.setState({newGameId: response.data.addGame.id})
      });
    }
  }

  public handleNameChange(value: string) {
    this.setState({ name: value });
  }

  public handleWordsChange(value: string) {
    const words: string[] = value
      .split(/ |,/)
      .filter((word: string) => word.length !== 0);
    const wordRegex = /^[a-z]+$/;
    let invalidWords = words.filter(word => !wordRegex.test(word));
    if (invalidWords.length === 0) {
      invalidWords = null as any;
    }
    this.setState({ words, errors: { invalidWords } });
  }

  private renderWords(words: string[], errors: null | string[]) {
    if (errors) {
      return this.renderWordsErrors(errors);
    } else if (!words.length) {
      return <div />;
    }
    const renderWords = () => {
      return words.map((word: string, index: number) => (
        <span className="new-game-word-list-item" key={index}>
          {word}
        </span>
      ));
    };
    return (
      <div className="alert alert-success">
        <b>{"You're good to go. Words to be used:"}</b>
        <br />
        <div className="new-game-word-list">{renderWords()}</div>
      </div>
    );
  }

  private renderWordsErrors(errors: string[]) {
    const renderErrors = () => {
      return errors.map((word: string, index: number) => (
        <span className="new-game-word-list-item" key={index}>
          {word}
        </span>
      ));
    };
    return (
      <div className="alert alert-danger">
        <b>It seems like you have invalid words in your list. Invalid words:</b>
        <br />
        <div className="new-game-word-list">{renderErrors()}</div>
      </div>
    );
  }

  private hasError(): boolean | undefined {
    return this.state.invalidWords as any;
  }

  private renderError() {
    if (this.props.newGameStatus && this.props.newGameStatus.error) {
      return (
        <div className="alert alert-danger">
          <b>Error:</b>
          <br />
          {this.props.newGameStatus.error}
        </div>
      );
    }
    return <div />;
  }

  private handleAvialabilityChange(value: any) {
    const range = value["availability"];
    let availableFrom = range["startDate"];
    let availableTo = range["endDate"];
    this.setState({
      availableRange: {
        startDate: availableFrom,
        endDate: availableTo,
        key: this.state.availableRange.key
      }
    });
  }
}

export default NewGame;
