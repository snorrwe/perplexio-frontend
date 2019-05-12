import * as React from "react";
import PuzzleTable from "../components/PuzzleTable";
import GameAdmin from "../components/GameAdmin";
import { Card, CardTitle, CardText, Button, Grid, Cell } from "react-md";
import { Query, ApolloConsumer, Mutation } from "react-apollo";
import { ApolloClient } from "apollo-boost";
import gql from "graphql-tag";
import GraphQLError from "../components/GraphQLError";
import * as moment from "moment";

import "../index.css";

const PARTICIPATION_QUERY = gql`
  query($id: Int!) {
    participation(gameId: $id) {
      startTime
    }
  }
`;

const START_PARTICIPATION = gql`
  mutation($id: Int!) {
    startParticipation(gameId: $id)
  }
`;

const GAME_QUERY = gql`
  query($id: Int!) {
    game(id: $id) {
      id
      name
      owner
      availableFrom
      availableTo
      published
      isOwner
    }
    puzzle(gameId: $id) {
      gameTable
      columns
      rows
      words
    }
  }
`;

const SOLUTION_QUERY = gql`
  query($id: Int!) {
    getSolutionByGameId(gameId: $id) {
      solution1 {
        x
        y
      }
      solution2 {
        x
        y
      }
    }
    participation(gameId: $id) {
      startTime
      endTime
    }
  }
`;

const SOLUTION_SUBMIT = gql`
  mutation($id: Int!, $solution: [Int!]!) {
    submitSolution(gameId: $id, solution: $solution)
  }
`;

class Game extends React.Component {
  public props: { match: any };

  public state = {
    availableFrom: undefined,
    availableTo: undefined,
    name: undefined,
    renderSolutions: true,
    game: undefined,
    refetchSolutions: () => {},
    refetchGame: () => {},
    apolloClient: {} as ApolloClient<any>
  };

  constructor(props) {
    super(props);
    this.submitSolution = this.submitSolution.bind(this);
  }

  public render() {
    let gameId = this.props.match.params.id;
    if (!gameId) {
      return (
        <a href="#/">
          <Button flat={true}>Take me back to the home page</Button>
        </a>
      );
    }

    return (
      <Query query={PARTICIPATION_QUERY} variables={{ id: parseInt(gameId) }}>
        {({ loading, error, data, refetch }) => {
          if (loading) return <div className="loading" />;
          if (error) return this.renderError(error);

          if (!data.participation) {
            return (
              <Mutation mutation={START_PARTICIPATION}>
                {startParticipation => {
                  const start = _e =>
                    startParticipation({
                      variables: { id: parseInt(gameId) }
                    }).then(() => refetch());
                  return (
                    <Button flat={true} onClick={start}>
                      Start Participating
                    </Button>
                  );
                }}
              </Mutation>
            );
          }

          return (
            <ApolloConsumer>
              {client => (
                <Query query={GAME_QUERY} variables={{ id: parseInt(gameId) }}>
                  {({ loading, error, data, refetch }) => {
                    if (loading) return <div className="loading" />;
                    if (error) return this.renderError(error);

                    const game = data.game;
                    const puzzle = data.puzzle;
                    const loading1 = loading;
                    const error1 = error;
                    const refetchGame = refetch;
                    return (
                      <Query
                        query={SOLUTION_QUERY}
                        variables={{ id: parseInt(gameId) }}
                      >
                        {({ data, refetch, loading, error }) => {
                          const solutions = data.getSolutionByGameId;
                          const participation = data.participation;
                          const refetchSolutions = refetch;
                          const refetchAll = () => {
                            refetchSolutions();
                            refetchGame();
                          };
                          return this.renderGame(
                            {
                              refetchSolutions,
                              refetchGame: refetchAll,
                              game,
                              puzzle,
                              loading: loading1 || loading,
                              error: error1 || error,
                              solutions,
                              participation
                            },
                            client
                          );
                        }}
                      </Query>
                    );
                  }}
                </Query>
              )}
            </ApolloConsumer>
          );
        }}
      </Query>
    );
  }

  private renderGame(
    {
      loading,
      game,
      puzzle,
      solutions,
      error,
      refetchSolutions,
      refetchGame,
      participation
    },
    client: ApolloClient<any>
  ) {
    this.state.refetchSolutions = refetchSolutions; // Do not trigger rerender
    this.state.refetchGame = refetchGame; // Do not trigger rerender
    this.state.apolloClient = client; // Do not trigger rerender
    this.state.game = game; // Do not trigger rerender
    if (loading) {
      return <h4>Loading...</h4>;
    }
    if (error) {
      return this.renderError(error);
    }

    return (
      <Grid>
        <Cell size={2}>
          {this.renderParticipation(participation)}
          Find these words
          <ul>
            {puzzle.words.map(w => (
              <li>{w}</li>
            ))}
          </ul>
        </Cell>
        <Cell size={4}>
          <PuzzleTable
            renderSolutions={this.state.renderSolutions}
            game={game}
            puzzle={puzzle}
            solutions={solutions}
            submitSolution={this.submitSolution}
          />
        </Cell>
        <Cell size={6}>{this.renderAdmin(game, client, refetchGame)}</Cell>
      </Grid>
    );
  }

  private renderParticipation(participation) {
    if (participation.endTime) {
      let end = moment(participation.endTime);
      let start = moment(participation.startTime);
      let duration = moment.duration(end.diff(start));
      return (
        <>
          <h4 className="participation">
            You finished in {duration.humanize()}!
          </h4>
        </>
      );
    }
  }

  private submitSolution(solution1, solution2) {
    const game = this.state.game as any;
    if (!solution1 || !solution2 || game == null) {
      return;
    }
    [solution1, solution2] = [solution1, solution2].sort(
      (a, b) => a.x - b.x || a.y - b.y
    );
    this.state.apolloClient
      .mutate({
        mutation: SOLUTION_SUBMIT,
        variables: {
          id: game.id,
          solution: [solution1.x, solution1.y, solution2.x, solution2.y]
        }
      })
      .then(response => {
        const found = response.data.submitSolution;
        if (found) {
          this.state.refetchSolutions();
        }
      });
  }

  private renderError(error: any): any {
    console.error("Rendering an error", error);
    if (error.message) {
      return <GraphQLError error={error} />;
    } else {
      let backHref = "#/";
      // TODO: refresh the current game if we have id, go back otherwise
      return (
        <Card>
          <div className="alert-danger">
            <CardTitle title="Error" />
            <CardText>
              <div>{error}</div>
              <a href={backHref}>
                <Button flat={true}>Take me back to the home page</Button>
              </a>
            </CardText>
          </div>
        </Card>
      );
    }
  }

  public renderAdmin(
    game: any,
    client: any,
    refetchAll: (...args: any[]) => {}
  ) {
    if (!game.isOwner) {
      return null;
    }
    return <GameAdmin game={game} client={client} refetchGame={refetchAll} />;
  }
}

export default Game;
