import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, fetchGameById, receiveCurrentGame } from "../actions";
import PuzzleTable from "../components/PuzzleTable";
import GameAdmin from "../components/GameAdmin";

class Game extends React.Component {
  public static propTypes = {
    game: PropTypes.any
  };

  public props: any;
  public state = {
    availableFrom: undefined,
    availableTo: undefined,
    name: undefined,
    renderSolutions: true,
    game: undefined
  };

  public render() {
    if (!this.props.game) {
      return <h4>Loading...</h4>;
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
          <div className="col-md-6">{this.renderAdmin(this.props.game)}</div>
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

  private renderAdmin(game: any) {
    if (!game.is_owner && !game.isOwner) {
      return null;
    }
    return <GameAdmin game={game} />;
  }

  public componentDidMount() {
    this.props.fetchGameById(this.props.config, this.props.match.params.id);
  }

  public componentWillUnmount() {
    this.props.receiveCurrentGame(null);
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
