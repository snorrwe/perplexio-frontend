import * as PropTypes from "prop-types";
import * as React from "react";
import { Layer, Stage } from "react-konva";
import PuzzleNode from "./PuzzleNode";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Solution from "./Solution";

const WIDTH = 500;
const HEIGHT = 510;

class PuzzleTable extends React.Component {
  public static propTypes = {
    game: PropTypes.any,
    renderSolutions: PropTypes.bool
  };

  public props: any;

  private fontSize: number;

  public render() {
    const game = this.props.game;
    const rows = (this.props.game && this.props.game.table.table) || [];
    const cols = this.props.game.table.columns;
    const width = cols > rows.length ? cols : rows.length;
    this.fontSize = WIDTH / width;
    return (
      <div>
        <h1>{game && game.id.name}</h1>
        <small>by {game && game.id.owner}</small>
        <Stage width={WIDTH} height={HEIGHT}>
          <Layer>{this.solutions()}</Layer>
          <Layer>{this.selection()}</Layer>
          <Layer>{this.table(game)}</Layer>
        </Stage>
      </div>
    );
  }

  private selection() {
    if (
      !this.props.currentSelection[0] ||
      this.props.currentSelection[1] ||
      !this.props.currentHover
    ) {
      return null;
    }
    return (
      <Solution
        solution={[this.props.currentSelection[0], this.props.currentHover]}
        size={this.fontSize}
        color="#1515FF"
      />
    );
  }

  private table(game: any) {
    if (!game) {
      return [];
    }
    const rows = (this.props.game && this.props.game.table.table) || [];
    const cols = this.props.game.table.columns;
    const width = cols > rows.length ? cols : rows.length;
    this.fontSize = WIDTH / width;
    return rows.map((row: any, y: number) =>
      row
        .split("")
        .map((chr: string, x: number) => (
          <PuzzleNode
            value={chr}
            x={x}
            y={y}
            key={y * width + x}
            fontSize={this.fontSize}
          />
        ))
    );
  }

  private solutions() {
    if (!this.props.renderSolutions) {
      return;
    }
    const solutions: any[] = this.props.solutions || [];
    return solutions.map((solution: { x: number; y: number }[]) => {
      let startx = solution[0].x;
      let starty = solution[0].y;
      return (
        <Solution
          solution={solution}
          size={this.fontSize}
          color="#3bba14"
          key={"" + startx + starty}
        />
      );
    });
  }
}

const mapStateToProps = (state: any) => ({
  game: state.currentGame,
  currentSelection: state.currentSelection,
  currentHover: state.hover,
  solutions: state.solutions
});
const mapDispathToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispathToProps
)(PuzzleTable);
