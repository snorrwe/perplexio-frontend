import * as PropTypes from "prop-types";
import * as React from "react";
import { Link } from "react-router-dom";
import { Subheader, List, ListItem } from "react-md";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GAME_LIST_QUERY = gql`
  {
    games {
      items {
        id
        name
        owner
        availableTo
        published
        isOwner
      }
      totalPages
      page
    }
  }
`;

class GameList extends React.Component {
  public static propTypes = {
    games: PropTypes.array
  };

  public props: any;

  public render() {
    return <Query query={GAME_LIST_QUERY}>{i => this.renderContent(i)}</Query>;
  }

  private renderContent({ loading, data, error }: any) {
    if (loading) return "Loading...";
    if (error) return "Failed to fetch games :(";

    return (
      <>
        <div className="md-grid">
          <List className="md-cell md-paper md-paper--1">
            <Subheader primary={true} primaryText="Available games" />
            {this.renderGames(data.games.items)}
          </List>
        </div>
      </>
    );
  }

  public componentDidMount() {
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

export default GameList;
