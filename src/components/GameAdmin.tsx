import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, refreshUpdateGameForm, updateGame } from "../actions";

class GameAdmin extends React.Component {
  public static propTypes = {
    updateForm: PropTypes.any
  };

  public props: any;

  constructor(props: any) {
    super(props);
    this.generateBoard = this.generateBoard.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.toggleSolutions = this.toggleSolutions.bind(this);
    this.updateGame = this.updateGame.bind(this);
  }

  public render() {
    let updateForm = this.props.updateForm;
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-primary" onClick={this.toggleSolutions}>
              Toggle solutions
            </button>
            <button className="btn btn-danger" onClick={this.generateBoard}>
              Regenerate board
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Name of the game</label>
              <input
                name="name"
                className="form-control"
                type="text"
                required={true}
                value={updateForm.name}
                onChange={this.handleFormChange}
                placeholder="Name of the game"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Competition start</label>
              <input
                name="availableFrom"
                className="form-control"
                type="datetime-local"
                required={true}
                value={updateForm.availableFrom || Date.now()}
                onChange={this.handleFormChange}
                placeholder="Competition start"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Competition end</label>
              <input
                name="availableTo"
                className="form-control"
                type="datetime-local"
                required={true}
                value={updateForm.availableTo || Date.now()}
                onChange={this.handleFormChange}
                placeholder="Competition end"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-success" onClick={this.updateGame}>
              Update game
            </button>
          </div>
        </div>
      </div>
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
