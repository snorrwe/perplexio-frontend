import * as PropTypes from "prop-types";
import * as React from "react";
import { Rect } from "react-konva";

export interface Vector {
  x: number;
  y: number;
}

class Solution extends React.Component {
  public static propTypes = {
    size: PropTypes.number,
    solution: PropTypes.any,
    color: PropTypes.any
  };
  public props: any;

  public render() {
    let solution = this.props.solution.sort(
      (a: Vector, b: Vector) => a.x - b.x || a.y - b.y
    );
    let startx = solution[0].x * this.props.size;
    let starty = solution[0].y * this.props.size;
    let x = solution[1].x * this.props.size - startx;
    let y = solution[1].y * this.props.size - starty;
    let len = Math.sqrt(x * x + y * y);
    if (!len) {
      return null;
    }
    let angle = Math.acos(x / len);
    angle *= 180 / Math.PI;
    if (y < 0) {
      angle *= -1;
    }
    let offset = this.props.size / 2;
    return (
      <Rect
        cornerRadius={100}
        width={len + this.props.size}
        height={this.props.size}
        x={startx + offset}
        y={starty + offset}
        rotation={angle}
        opacity={0.5}
        offsetX={offset}
        offsetY={offset}
        fill={this.props.color || "orange"}
        key={"" + startx + starty}
      />
    );
  }
}

export default Solution;
