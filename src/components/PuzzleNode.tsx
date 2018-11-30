import * as PropTypes from "prop-types";
import * as React from "react";
import { Text } from "react-konva";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { startSelection, endSelection } from "../actions";

class PuzzleNode extends React.Component {
  public static propTypes = {
    fontSize: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
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
        fontSize={fontSize-2}
        width={fontSize}
        height={fontSize}
        align="center"
      />
    );
  }

  public componentDidMount() {
    this.node.on("mousedown", (event: any) => {
      this.props.startSelection(this.props);
    });
    this.node.on("mouseup", (event: any) => {
      this.props.endSelection(this.props);
    });
  }
}

const mapStateToProps = (state: any) => ({});
const mapDispathToProps = (dispatch: any) =>
  bindActionCreators({ startSelection, endSelection }, dispatch);

export default connect(
  mapStateToProps,
  mapDispathToProps
)(PuzzleNode);
