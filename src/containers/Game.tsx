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
    availableTo: undefined
  };

  constructor(props: any) {
    super(props);
    this.generateBoard = this.generateBoard.bind(this);
    this.handleAvailableToChange = this.handleAvailableToChange.bind(this);
    this.handleAvailableFromChange = this.handleAvailableFromChange.bind(this);
  }

  public render() {
    if (this.props.game) {
      if (!this.props.game.error) {
        return (
          <div className="row">
            <div className="col-md-6">
              <PuzzleTable game={this.props.game} />
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
    return null;
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
            <button className="btn btn-primary" onClick={this.generateBoard}>
              Regenerate
            </button>
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
                value={this.state.availableFrom}
                onChange={this.handleAvailableFromChange}
                placeholder="Comperation start"
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Comperation end</label>
              <input
                className="form-control"
                type="datetime-local"
                required={true}
                value={this.state.availableFrom}
                onChange={this.handleAvailableToChange}
                placeholder="Comperation end"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleAvailableFromChange(event: any) {
    this.state.availableFrom = event.value;
  }

  private handleAvailableToChange(event: any) {
    this.state.availableTo = event.value;
  }

  private generateBoard(event: any) {
    event.preventDefault();
    this.props.regenerateGame(this.props.config, this.props.match.params.id);
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
