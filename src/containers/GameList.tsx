import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { fetchGameById, fetchGames } from "../actions";
import { Subheader, Button, List, ListItem } from "react-md";

class GameList extends React.Component {
  public static propTypes = {
    games: PropTypes.array
  };

  public props: any;

  constructor(props: any) {
    super(props);
    this.listGames = this.listGames.bind(this);
  }

  public render() {
    return (
      <>
        <div className="md-grid">
          <div className="md-cell">
            <Button raised={true} primary={true} onClick={this.listGames}>
              Refresh Games
            </Button>
          </div>
        </div>
        <div className="md-grid">
          <List className="md-cell md-paper md-paper--1">
            <Subheader primary={true} primaryText="Available games" />
            {this.renderGames(this.props.games)}
          </List>
        </div>
      </>
    );
  }

  public componentDidMount() {
    this.listGames();
  }

  public listGames() {
    this.props.fetchGames(this.props.config);
  }

  private renderGames(games?: any[]) {
    if (!games) {
      return [];
    }
    return games.map((game: any) => (
      <Link to={"/game/" + game.id} key={game.id}>
        <ListItem primaryText={game.name + " by " + game.owner} />
      </Link>
    ));
  }
}

const mapStateToProps = (state: any) => ({
  games: state.games,
  config: state.config
});
const mapDispathToProps = (dispatch: any) =>
  bindActionCreators({ fetchGameById, fetchGames }, dispatch);

export default connect(
  mapStateToProps,
  mapDispathToProps
)(GameList);
