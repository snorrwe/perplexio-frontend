import * as React from "react";
import { HashRouter as Router, Link, Route } from "react-router-dom";
import Game from "./Game";
import GameList from "./GameList";
import NewGame from "./NewGame";
import "../index.css";
import { Button } from "react-md";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const USERINFO_QUERY = gql`
  query {
    userInfo {
      name
    }
  }
`;

class App extends React.Component {
  public props: any;

  public render() {
    return (
      <Router>
        <div>
          <Query query={USERINFO_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return <div>"Loading..."</div>;
              return (
                <>
                  {this.renderHeader({ data })}
                  <Route exact={true} path="/" component={GameList} />
                  <Route path="/game" />
                  <Route path="/game/:id" component={Game} />
                  <Route path="/newgame" component={NewGame} />
                </>
              );
            }}
          </Query>
        </div>
      </Router>
    );
  }

  private renderHeader({ data }) {
    let name: string = data && data.userInfo && data.userInfo.name;
    return (
      <header className="App-header">
        {name ? <p className="username">Hello, {name}</p> : null}
        <Link to="/">
          <Button primary={true} raised={true}>
            Home
          </Button>
        </Link>
        {name ? (
          <Link to="/newgame">
            <Button primary={true} raised={true}>
              New Game
            </Button>
          </Link>
        ) : null}
        {this.renderLogin(data)}
      </header>
    );
  }

  private renderLogin(data) {
    if (data && data.userInfo) {
      return (
        <a href={this.props.config.apiBaseUrl + "/logout"}>
          <Button raised={true} primary={true}>
            Log out
          </Button>
        </a>
      );
    }
    if (this.props.config) {
      return (
        <a href={this.props.config.apiBaseUrl + "/login"}>
          <Button raised={true} primary={true}>
            Log In
          </Button>
        </a>
      );
    }
    return null;
  }
}

export default App;
