import * as React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Link, Route } from "react-router-dom";
import { bindActionCreators } from "redux";
import Game from "./Game";
import GameList from "./GameList";
import NewGame from "./NewGame";
import "./App.css";

class App extends React.Component {
  public props: any;

  constructor(props: any) {
    super(props);
    this.renderLogin = this.renderLogin.bind(this);
  }

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.renderLogin()}
        </header>
        <Router>
          <div>
            <Link to="/">Home</Link>
            <Link to="/newgame">New Game</Link>
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
      return <h4>Hello, {this.props.userinfo.name}</h4>;
    }
    if (this.props.config) {
      return (
        <a
          className="btn btn-primary"
          href={this.props.config.apiBaseUrl + "/login"}
        >
          Log In
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
