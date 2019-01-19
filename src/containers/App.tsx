import * as React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Link, Route } from "react-router-dom";
import { bindActionCreators } from "redux";
import Game from "./Game";
import GameList from "./GameList";
import NewGame from "./NewGame";
import "./App.scss";
import { Button } from "react-md";

class App extends React.Component {
  public props: any;

  constructor(props: any) {
    super(props);
    this.renderLogin = this.renderLogin.bind(this);
  }

  public render() {
    return (
      <div className="App">
        <Router>
          <div>
            <header className="App-header">
              <Link to="/">
                <Button primary={true} raised={true}>
                  Home
                </Button>
              </Link>
              <Link to="/newgame">
                <Button primary={true} raised={true}>
                  New Game
                </Button>
              </Link>
              {this.renderLogin()}
            </header>
            <Route exact={true} path="/" component={GameList} />
            <Route path="/game" />
            <Route path="/game/:id" component={Game} />
            <Route path="/newgame" component={NewGame} />
          </div>
        </Router>
      </div>
    );
  }

  private renderLogin() {
    if (this.props.userinfo) {
      return <>Hello, {this.props.userinfo.name}</>;
    }
    if (this.props.config) {
      return (
        <a href={this.props.config.apiBaseUrl + "/login"}>
          <Button primary={true}>Log In</Button>
        </a>
      );
    }
    return null;
  }
}

const mapStateToProps = (state: any) => ({
  config: state.config,
  userinfo: state.userinfo
});
const mapDispathToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispathToProps
)(App);
