import * as PropTypes from "prop-types";
import * as React from "react";
import { Layer, Stage } from "react-konva";
import PuzzleNode from "./PuzzleNode";
import Solution from "./Solution";
import { Vector } from "./Solution";

const WIDTH = 500;
const HEIGHT = 510;

class PuzzleTable extends React.Component {
  public static propTypes = {
    game: PropTypes.any.isRequired,
    puzzle: PropTypes.any.isRequired,
    solutions: PropTypes.any.isRequired,
    renderSolutions: PropTypes.bool,
    submitSolution: PropTypes.func.isRequired
  };

  public props: any;

  private fontSize: number;
  public state: any = {
    currentSelection: null,
    currentHover: null
  };

  constructor(props: any) {
    super(props);

    this.receiveHoveredNode = this.receiveHoveredNode.bind(this);
    this.startSelection = this.startSelection.bind(this);
    this.endSelection = this.endSelection.bind(this);
  }

  public render() {
    const game = this.props.game;
    const puzzle = this.props.puzzle;
    const rows = puzzle.gameTable || [];
    const cols = puzzle.columns;
    const width = cols > rows.length ? cols : rows.length;
    this.fontSize = WIDTH / width;
    return (
      <div>
        <h1>{game && game.name}</h1>
        <small>by {game && game.owner}</small>
        <Stage width={WIDTH} height={HEIGHT}>
          <Layer>{this.solutions()}</Layer>
          <Layer>{this.selection()}</Layer>
          <Layer>{this.table(rows, cols)}</Layer>
        </Stage>
      </div>
    );
  }

  private selection() {
    if (!this.state.currentSelection || !this.state.currentHover) {
      return null;
    }
    return (
      <Solution
        solution={[this.state.currentSelection, this.state.currentHover]}
        size={this.fontSize}
        color="#1515FF"
      />
    );
  }

  private table(rows: string[], cols: number) {
    if (!rows || !rows.length) {
      return [];
    }
    const width = cols > rows.length ? cols : rows.length;
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
            receiveHoveredNode={this.receiveHoveredNode}
            startSelection={this.startSelection}
            endSelection={this.endSelection}
          />
        ))
    );
  }

  private receiveHoveredNode(node) {
    this.setState({
      currentHover: node
    });
  }

  private startSelection(node) {
    console.log("startSelection", node);
    this.setState({ currentSelection: node });
  }

  private endSelection(node) {
    console.log("endSelection", node);
    this.props.submitSolution(this.state.currentSelection, node);
    this.setState({ currentSelection: null });
  }

  private solutions() {
    if (!this.props.renderSolutions) {
      return;
    }
    const solutions: any[] = this.props.solutions || [];
    return solutions.map(
      (solution: { solution1: Vector; solution2: Vector }) => {
        let startx = solution.solution1.x;
        let starty = solution.solution1.y;

        return (
          <Solution
            solution={[solution.solution1, solution.solution2]}
            size={this.fontSize}
            color="#3bba14"
            key={"" + startx + starty}
          />
        );
      }
    );
  }
}

export default PuzzleTable;
