import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, refreshUpdateGameForm, updateGame } from "../actions";
import { Button } from "react-md/lib/Buttons";
import InputField from "react-md/lib/TextFields";
import { DatePicker, Grid, Cell } from "react-md";

const DATE_FORMAT_OPTIONS: any = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

class GameAdmin extends React.Component {
  public static propTypes = {
    updateForm: PropTypes.any,
    game: PropTypes.any
  };

  public props: any;

  constructor(props: any) {
    super(props);
    this.generateBoard = this.generateBoard.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.toggleSolutions = this.toggleSolutions.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.handleAvaibleToChange = this.handleAvaibleToChange.bind(this);
    this.handleAvaibleFromChange = this.handleAvaibleFromChange.bind(this);
  }

  public render() {
    let updateForm = this.props.updateForm;
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
                name="name"
                label="Name of the game"
                className="form-control"
                type="text"
                required={true}
                value={updateForm.name}
                onChange={this.handleFormChange}
                placeholder="Name of the game"
              />
            </div>
          </Cell>
        </Grid>
        <Grid>
          <Cell size={8}>
            <DatePicker
              id="availableFrom"
              displayMode="portrait"
              required={true}
              value={updateForm.availableFrom || Date.now()}
              autoOk={true}
              onChange={this.handleAvaibleFromChange}
              label="Competition start"
              formatOptions={DATE_FORMAT_OPTIONS}
            />
          </Cell>
        </Grid>
        <Grid>
          <Cell size={8}>
            <DatePicker
              id="availableTo"
              displayMode="portrait"
              required={true}
              value={updateForm.availableTo || Date.now()}
              autoOk={true}
              onChange={this.handleAvaibleToChange}
              label="Competition end"
              formatOptions={DATE_FORMAT_OPTIONS}
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

  private handleFormChange(event: any) {
    if (!event || !event.target) {
      return;
    }
    const value = event.target.value;
    const name = event.target.name;
    this.updateForm(name, value);
  }

  private handleAvaibleFromChange(value: string, dateValue: Date, event: any) {
    this.updateForm("availableFrom", dateValue);
  }

  private handleAvaibleToChange(value: string, dateValue: Date, event: any) {
    this.updateForm("availableTo", dateValue);
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
