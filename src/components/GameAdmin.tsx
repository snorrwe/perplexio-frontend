import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, fetchGameById, receiveCurrentGame } from "../actions";

class GameAdmin extends React.Component {
  public static propTypes = {
    game: PropTypes.any,
      gameId: PropTypes.string
  };

  public props: any;

  constructor(props: any) {
    super(props);
    this.generateBoard = this.generateBoard.bind(this);
    this.handleAvailableToChange = this.handleAvailableToChange.bind(this);
    this.handleAvailableFromChange = this.handleAvailableFromChange.bind(this);
    this.toggleSolutions = this.toggleSolutions.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.updateGame = this.updateGame.bind(this);
  }

  public render() {
    return this.renderAdminFeatures(this.props.game);
  }

  private renderAdminFeatures(game: any) {
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
                className="form-control"
                type="text"
                required={true}
                value={game.id.name}
                onChange={this.handleNameChange}
                placeholder="Name of the game"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Comperation start</label>
              <input
                className="form-control"
                type="datetime-local"
                required={true}
                value={game.id.availableFrom}
                onChange={this.handleAvailableFromChange}
                placeholder="Comperation start"
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Comperation end</label>
              <input
                className="form-control"
                type="datetime-local"
                required={true}
                value={game.id.availableTo}
                onChange={this.handleAvailableToChange}
                placeholder="Comperation end"
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
    let game = this.props && this.props.game;
    if (!game) {
      return;
    }
    console.log("TODO send update", game);
  }

  private handleNameChange(event: any) {
    if (!event || !event.target) {
      return;
    }
    const value = event.target.value;
    this.props.game.id.name = value;
    this.props.receiveCurrentGame(this.props.game);
  }

  private handleAvailableFromChange(event: any) {
    if (!event || !event.target) {
      return;
    }
    const value = event.target.value;
    this.props.game.id.availableFrom = value;
    this.props.receiveCurrentGame(this.props.game);
  }

  private handleAvailableToChange(event: any) {
    if (!event || !event.target) {
      return;
    }
    const value = event.target.value;
    this.props.game.id.availableTo = value;
    this.props.receiveCurrentGame(this.props.game);
  }

  private generateBoard(event: any) {
    event.preventDefault();
    this.props.regenerateGame(this.props.config, this.props.game.id.id);
  }

  private toggleSolutions(event: any) {
    event.preventDefault();
      // TODO: propagate showSolutions 
  }
}

const mapStateToProps = (state: any) => ({
  config: state.config,
  game: state.currentGame
});

const mapDispathToProps = (dispatch: any) =>
  bindActionCreators(
    { regenerateGame, fetchGameById, receiveCurrentGame },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispathToProps
)(GameAdmin);
