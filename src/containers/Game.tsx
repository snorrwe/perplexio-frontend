import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, fetchGameById, receiveCurrentGame } from "../actions";
import PuzzleTable from "../components/PuzzleTable";

class Game extends React.Component {
  public static propTypes = {
    game: PropTypes.any
  };

  public props: any;
  public state = {
    availableFrom: undefined,
    availableTo: undefined,
    renderSolutions: true
  };

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
    if (!this.props.game) {
      return null;
    }
    if (!this.props.game.error) {
      return (
        <div className="row">
          <div className="col-md-6">
            <PuzzleTable
              renderSolutions={this.state.renderSolutions}
              game={this.props.game}
            />
          </div>
          <div className="col-md-6">
            {this.renderAdminFeatures(this.props.game)}
          </div>
        </div>
      );
    } else if (this.props.game.error === 404) {
      return <div className="alert alert-danger">404 Game not found</div>;
    } else {
      return (
        <div className="alert alert-danger">
          Error loading game: {this.props.game.error}
        </div>
      );
    }
  }

  public componentDidMount() {
    this.props.fetchGameById(this.props.config, this.props.match.params.id);
  }

  public componentWillUnmount() {
    this.props.receiveCurrentGame(null);
  }

  private renderAdminFeatures(game: any) {
    if (!game.is_owner) {
      return null;
    }
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
                value={game.availableFrom}
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
                value={game.availableTo}
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
    // TODO
  }

  private handleNameChange(event: any) {
    this.setState((state: any, props: any) => {
      props.game.id.name = event.value;
      return {
        name: event.value
      };
    });
  }

  private handleAvailableFromChange(event: any) {
    this.setState((state: any, props: any) => {
      props.game.availableFrom = event.value;
      return {
        availableFrom: event.value
      };
    });
  }

  private handleAvailableToChange(event: any) {
    this.setState((state: any, props: any) => {
      props.game.availableTo = event.value;
      return {
        availableTo: event.value
      };
    });
  }

  private generateBoard(event: any) {
    event.preventDefault();
    this.props.regenerateGame(this.props.config, this.props.match.params.id);
  }

  private toggleSolutions(event: any) {
    event.preventDefault();
    this.setState({
      renderSolutions: !this.state.renderSolutions
    });
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
)(Game);
