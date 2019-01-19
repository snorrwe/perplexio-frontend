import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, refreshUpdateGameForm, updateGame } from "../actions";
import { Button } from "react-md/lib/Buttons";
import InputField from "react-md/lib/TextFields";
import { Grid, Cell } from "react-md";
import { DateRange } from "react-date-range";

class GameAdmin extends React.Component {
  public static propTypes = {
    updateForm: PropTypes.any,
    game: PropTypes.any
  };

  public props: any;

  constructor(props: any) {
    super(props);
    this.generateBoard = this.generateBoard.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.toggleSolutions = this.toggleSolutions.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.handleAvialabilityChange = this.handleAvialabilityChange.bind(this);
  }

  public render() {
    let updateForm = this.props.updateForm;
    let availableRange = {
      startDate: new Date(updateForm.availableFrom),
      endDate: new Date(updateForm.availableTo),
      key: "availability"
    };
    return (
      <>
        <Grid>
          <Cell size={4}>
            <Button raised={true} primary={true} onClick={this.toggleSolutions}>
              Toggle solutions
            </Button>
          </Cell>
          <Cell size={4}>
            <Button raised={true} secondary={true} onClick={this.generateBoard}>
              Regenerate board
            </Button>
          </Cell>
        </Grid>
        <Grid>
          <Cell size={8}>
            <div className="form-group">
              <InputField
                id="name"
                name="name"
                label="Name of the game"
                type="text"
                required={true}
                value={updateForm.name}
                onChange={this.handleNameChange}
              />
            </div>
          </Cell>
        </Grid>
        <Grid>
          <Cell size={8}>
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
    let form = JSON.parse(JSON.stringify(this.props.updateForm));
    form[key] = value;
    this.props.refreshUpdateGameForm(form);
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
}

const mapStateToProps = (state: any) => ({
  config: state.config,
  updateForm: state.updateForm
});

const mapDispathToProps = (dispatch: any) =>
  bindActionCreators(
    { regenerateGame, refreshUpdateGameForm, updateGame },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispathToProps
)(GameAdmin);
