import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { regenerateGame, fetchGameById, receiveCurrentGame } from "../actions";
import PuzzleTable from "../components/PuzzleTable";
import GameAdmin from "../components/GameAdmin";
import { Card, CardTitle, CardText, Button, Grid, Cell } from "react-md";

import "../index.css";

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

  constructor(props: any) {
    super(props);
    this.handleBack = this.handleBack.bind(this);
  }

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
    } else {
      return this.renderError(this.props.game);
    }
  }

  private renderError(game: any) {
    if (game.error === 404) {
      return (
        <Card>
          <div className="alert-danger">
            <CardTitle title="Error" />
            <CardText>404 Game not found</CardText>
          </div>
        </Card>
      );
    } else {
      let backHref = "#/" + (game && game.id ? "game/" + game.id.id : "");
      // TODO: refresh the current game if we have id, go back otherwise
      return (
        <>
          <Card>
            <div className="alert-danger">
              <CardTitle title="Error" />
              <CardText>
                <div>{game.error}</div>
                <a href={backHref}>
                  <Button flat={true} onClick={this.handleBack}>
                    Back
                  </Button>
                </a>
              </CardText>
            </div>
          </Card>
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

  private handleBack() {
    this.props.receiveCurrentGame(null);
    this.props.fetchGameById(this.props.config, this.props.match.params.id);
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
