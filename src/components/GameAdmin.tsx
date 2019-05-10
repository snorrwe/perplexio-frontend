import * as PropTypes from "prop-types";
import * as React from "react";
import { Button } from "react-md/lib/Buttons";
import InputField from "react-md/lib/TextFields";
import { Grid, Cell } from "react-md";
import { DateRange } from "react-date-range";
import gql from "graphql-tag";

const PUBLISH_GAME = gql`
  mutation($id: Int!) {
    publishGame(gameId: $id)
  }
`;

const REGENERATE_PUZZLE = gql`
  mutation($id: Int!) {
    regeneratePuzzle(gameId: $id) {
      gameId
    }
  }
`;

const UPDATE_GAME = gql`
  mutation(
    $id: Int!
    $name: String
    $availableFrom: DateTimeUtc
    $availableTo: DateTimeUtc
  ) {
    updateGame(
      payload: {
        gameId: $id
        name: $name
        availableFrom: $availableFrom
        availableTo: $availableTo
      }
    ) {
      id
    }
  }
`;

class GameAdmin extends React.Component {
  public static propTypes = {
    game: PropTypes.any.isRequired,
    client: PropTypes.any.isRequired,
    refetchGame: PropTypes.func.isRequired
  };

  public props: any;

  public state: any = {
    updateForm: null
  };

  constructor(props: any) {
    super(props);
    this.generateBoard = this.generateBoard.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.toggleSolutions = this.toggleSolutions.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.handleAvialabilityChange = this.handleAvialabilityChange.bind(this);
    this.publishGame = this.publishGame.bind(this);
  }

  public render() {
    let game = this.state.updateForm;
    if (!game) {
      return "Loading...";
    }
    let availableRange = {
      startDate: new Date(game.availableFrom),
      endDate: new Date(game.availableTo),
      key: "availability"
    };
    if (game.published) {
      return (
        <>
          <Grid>
            <Cell size={4}>
              <div>Game is live until {game.availableTo}</div>
            </Cell>
          </Grid>
        </>
      );
    }
    // Toggle button
    // <Cell size={4}>
    //   <Button raised={true} primary={true} onClick={this.toggleSolutions}>
    //     Toggle solutions
    //   </Button>
    // </Cell>
    return (
      <>
        <Grid>
          <Cell size={4}>
            <Button raised={true} secondary={true} onClick={this.generateBoard}>
              Regenerate board
            </Button>
          </Cell>
        </Grid>
        <Grid>
          <Cell size={6}>
            <InputField
              id="name"
              name="name"
              label="Name of the game"
              type="text"
              required={true}
              value={game.name}
              onChange={this.handleNameChange}
            />
          </Cell>
        </Grid>
        <Grid>
          <Cell size={6}>
            <DateRange
              ranges={[availableRange]}
              minDate={new Date() as any}
              onChange={this.handleAvialabilityChange}
            />
          </Cell>
        </Grid>
        <Grid>
          <Cell size={4}>
            <Button raised={true} primary={true} onClick={this.updateGame}>
              Update game
            </Button>
          </Cell>
          <Cell size={4}>
            <Button raised={true} primary={true} onClick={this.publishGame}>
              Publish
            </Button>
          </Cell>
        </Grid>
      </>
    );
  }

  private updateGame(event: any) {
    event.preventDefault();
    let game = this.state.updateForm;
    if (!game) {
      return;
    }
    this.props.client
      .mutate({
        mutation: UPDATE_GAME,
        variables: this.state.updateForm
      })
      .then(response => {
        this.props.refetchGame();
      });
  }

  private updateForm(key: any, value: any): any {
    let updateForm = this.state.updateForm;
    updateForm[key] = value;
    this.setState({ updateForm });
  }

  private handleNameChange(value: any) {
    this.updateForm("name", value);
  }

  private handleAvialabilityChange(value: any) {
    const range = value["availability"];
    let availableFrom = range["startDate"];
    let availableTo = range["endDate"];
    let form = this.state.updateForm;
    form.availableFrom = availableFrom;
    form.availableTo = availableTo;
    this.setState({ updateForm: form });
  }

  private generateBoard(event: any) {
    event.preventDefault();
    this.props.client
      .mutate({
        mutation: REGENERATE_PUZZLE,
        variables: {
          id: this.props.game.id
        }
      })
      .then(result => {
        if (result.data) {
          this.props.refetchGame();
        }
      });
  }

  private toggleSolutions(event: any) {
    event.preventDefault();
    // TODO: propagate showSolutions
  }

  private publishGame() {
    this.props.client
      .mutate({
        mutation: PUBLISH_GAME,
        variables: {
          id: this.props.game.id
        }
      })
      .then(result => {
        this.props.refetchGame();
      });
  }

  public componentDidMount() {
    this.setState({ updateForm: JSON.parse(JSON.stringify(this.props.game)) });
  }
}

export default GameAdmin;
