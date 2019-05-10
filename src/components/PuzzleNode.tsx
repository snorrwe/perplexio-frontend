import * as PropTypes from "prop-types";
import * as React from "react";
import { Text } from "react-konva";

class PuzzleNode extends React.Component {
  public static propTypes = {
    fontSize: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    receiveHoveredNode: PropTypes.func.isRequired,
    startSelection: PropTypes.func.isRequired,
    endSelection: PropTypes.func.isRequired,
  };

  public props: any;
  private node: any;

  public render() {
    const fontSize = this.props.fontSize;
    return (
      <Text
        ref={ref => (this.node = ref)}
        listening={true}
        text={this.props.value}
        x={this.props.x * fontSize}
        y={this.props.y * fontSize}
        fontSize={fontSize - 2}
        width={fontSize}
        height={fontSize}
        align="center"
      />
    );
  }

  public componentDidMount() {
    if (!this.node) {
      return;
    }
    this.node.on("mouseenter", (event: any) => {
      this.props.receiveHoveredNode(this.props);
    });
    this.node.on("mousedown", (event: any) => {
      this.props.startSelection(this.props);
    });
    this.node.on("mouseup", (event: any) => {
      this.props.endSelection(this.props);
    });
  }
}

export default PuzzleNode;
