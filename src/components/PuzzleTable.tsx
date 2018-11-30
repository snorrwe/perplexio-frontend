import * as PropTypes from "prop-types";
import * as React from "react";
import { Layer, Stage } from "react-konva";
import PuzzleNode from "./PuzzleNode";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const WIDTH = 500;
const HEIGHT = 510;

class PuzzleTable extends React.Component {
  public static propTypes = {
    game: PropTypes.any
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
        </Stage>
      </div>
    );
  }

  public componentDidMount() {
  }

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
}

const mapStateToProps = (state: any) => ({
    game: state.currentGame,
});
const mapDispathToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(
    mapStateToProps,
    mapDispathToProps,
)(PuzzleTable);
