import * as PropTypes from "prop-types";
import * as React from "react";
import { Rect, Layer, Stage } from "react-konva";
import PuzzleNode from "./PuzzleNode";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

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
    return (
      <div>
        <h1>{game && game.id.name}</h1>
        <small>by {game && game.id.owner}</small>
        <Stage width={WIDTH} height={HEIGHT}>
          <Layer>{this.table()}</Layer>
          <Layer>{this.solutions()}</Layer>
        </Stage>
      </div>
    );
  }

  public componentDidMount() {}

  private table() {
    if (!this.props.game) {
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
    const solutions: any[] =
      (this.props.game && this.props.game.table.solutions) || [];
    return solutions.map((solution: { x: number; y: number }[]) => {
      solution = solution.sort((a, b) => a.x - b.x || a.y - b.y);
      let startx = solution[0].x * this.fontSize;
      let starty = solution[0].y * this.fontSize;
      let x = solution[1].x * this.fontSize - startx;
      let y = solution[1].y * this.fontSize - starty;
      let len = Math.sqrt(x * x + y * y);
      if (len == 0) {
        return null;
      }
      let angle = Math.acos(x / len);
      angle *= 180 / Math.PI;
      if (y < 0) {
        angle *= -1;
      }
      let offset = this.fontSize / 2;
      return (
        <Rect
          cornerRadius={100}
          width={len + this.fontSize}
          height={this.fontSize}
          x={startx + offset}
          y={starty + offset}
          rotation={angle}
          opacity={0.3}
          offsetX={offset}
          offsetY={offset}
          fill="red"
          key={"" + startx + starty + x + y}
        />
      );
    });
  }
}

const mapStateToProps = (state: any) => ({
  game: state.currentGame
});
const mapDispathToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispathToProps
)(PuzzleTable);
