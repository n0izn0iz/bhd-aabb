import { vec2 } from "gl-matrix";
import Direction from "td-direction";

export default class AABB {
  constructor({ position, size, bottomLeft = null, topRight, clone = null }) {
    if (clone !== null) {
      this.bottomLeft = clone.bottomLeft;
      this.topRight = clone.topRight;
    } else if (bottomLeft !== null) {
      this.bottomLeft = bottomLeft;
      this.topRight = topRight;
    } else {
      const x = position[0];
      const y = position[1];
      const halfSize = size / 2;
      this.bottomLeft = vec2.fromValues(x - halfSize, y - halfSize);
      this.topRight = vec2.fromValues(x + halfSize, y + halfSize);
    }
  }

  toString() {
    return `AABB { bottomLeft: ${this.bottomLeft}, topRight: ${this
      .topRight} }`;
  }

  quadrant(directionIndex) {
    const position = this.position;

    switch (directionIndex) {
      case Direction.topLeftIndex:
        const left = vec2.fromValues(this.bottomLeft[0], position[1]);
        const top = vec2.fromValues(position[0], this.topRight[1]);
        return new AABB({ bottomLeft: left, topRight: top });

      case Direction.topRightIndex:
        return new AABB({ bottomLeft: position, topRight: this.topRight });

      case Direction.bottomRightIndex:
        const bottom = vec2.fromValues(position[0], this.bottomLeft[1]);
        const right = vec2.fromValues(this.topRight[0], position[1]);
        return new AABB({ bottomLeft: bottom, topRight: right });

      case Direction.bottomLeftIndex:
        return new AABB({ bottomLeft: this.bottomLeft, topRight: position });
    }
  }

  set position(position) {
    const aABB = new AABB({ position });
    this.bottomLeft = aABB.bottomLeft;
    this.topRight = aABB.topRight;
  }

  get position() {
    return vec2.fromValues(
      this.bottomLeft[0] + this.halfSize,
      this.bottomLeft[1] + this.halfSize
    );
  }

  get topLeft() {
    return vec2.fromValues(this.bottomLeft[0], this.topRight[1]);
  }

  get bottomRight() {
    return vec2.fromValues(this.topRight[0], this.bottomLeft[1]);
  }

  get halfSize() {
    return this.size / 2;
  }

  get size() {
    return this.topRight[0] - this.bottomLeft[0];
  }

  collideAABB(other) {
    return (
      this.containsPoint(other.bottomLeft) ||
      this.containsPoint(other.topRight) ||
      this.containsPoint(other.bottomRight) ||
      this.containsPoint(other.topLeft)
    );
  }

  containsPoint(point) {
    return (
      point[0] >= this.bottomLeft[0] &&
      point[1] >= this.bottomLeft[1] &&
      point[0] <= this.topRight[0] &&
      point[1] <= this.topRight[1]
    );
  }

  containsAABB(other) {
    return (
      other.bottomLeft[0] >= this.bottomLeft[0] &&
      other.bottomLeft[1] >= this.bottomLeft[1] &&
      other.topRight[0] <= this.topRight[0] &&
      other.topRight[1] <= this.topRight[1]
    );
  }
}
