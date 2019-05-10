import * as PropTypes from "prop-types";
import * as React from "react";
import { Button } from "react-md/lib/Buttons";
import InputField from "react-md/lib/TextFields";
import { Grid, Cell } from "react-md";
import { DateRange } from "react-date-range";

class GameAdmin extends React.Component {
  public static propTypes = {
    game: PropTypes.any
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
    let game = this.props && this.props.updateForm;
    if (!game) {
      return;
    }
    this.props.updateGame(this.props.config, this.props.updateForm);
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
    let form = JSON.parse(JSON.stringify(this.props.updateForm));
    form.availableFrom = availableFrom;
    form.availableTo = availableTo;
    this.props.refreshUpdateGameForm(form);
  }

  private generateBoard(event: any) {
    event.preventDefault();
    this.props.regenerateGame(this.props.config, this.props.updateForm.id);
  }

  private toggleSolutions(event: any) {
    event.preventDefault();
    // TODO: propagate showSolutions
  }

  private publishGame() {
    const props = this.props;
    props.publishGame(props.config, props.game, this.props.updateForm);
  }

  public componentDidMount() {
    this.setState({ updateForm: JSON.parse(JSON.stringify(this.props.game)) });
  }
}

export default GameAdmin;
