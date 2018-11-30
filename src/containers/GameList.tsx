import * as PropTypes from "prop-types";
import * as React from "react";
import {connect} from "react-redux";
import { Link} from "react-router-dom";
import {bindActionCreators} from "redux";
import {fetchGameById, fetchGames} from "../actions";

class GameList extends React.Component {
    public static propTypes = {
        games: PropTypes.array,
    };

    public props: any;

    constructor(props: any) {
        super(props);
        this.listGames = this.listGames.bind(this);
    }

    public render() {
        return (
            <div>
            <button className="btn btn-primary" onClick={this.listGames}>
            Refresh Games
            </button>
            <ul>
            {this.renderGames(this.props.games)}
            </ul>
            </div>
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
            <li>{game.name} by {game.owner}</li>
            </Link>
        ));
    }
}

const mapStateToProps = (state: any) => ({games: state.games, config: state.config});
const mapDispathToProps = (dispatch: any) => bindActionCreators({ fetchGameById, fetchGames}, dispatch);

export default connect(mapStateToProps, mapDispathToProps)(GameList);
