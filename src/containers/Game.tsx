import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, fetchGameById, receiveCurrentGame } from "../actions";
import PuzzleTable from "../components/PuzzleTable";
import GameAdmin from "../components/GameAdmin";
import { Button, Grid, Cell } from "react-md";

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
        <Grid>
          <Cell size={6}>
            <PuzzleTable
              renderSolutions={this.state.renderSolutions}
              game={this.props.game}
            />
          </Cell>
          <Cell size={6}>{this.renderAdmin(this.props.game)}</Cell>
        </Grid>
      );
    } else if (this.props.game.error === 404) {
      return <div className="alert alert-danger">404 Game not found</div>;
    } else {
      let backHref =
        "#/" +
        (this.props.game && this.props.game.id
          ? "game/" + this.props.game.id.id
          : "");
        // TODO: refresh the current game if we have id, go back otherwise
      return (
        <>
          <div className="alert alert-danger">{this.props.game.error}</div>
          <a href={backHref}>
            <Button raised={true} primary={true}>
              Back
            </Button>
          </a>
        </>
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
  game: state.currentGame,
  error: state.gameError
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
