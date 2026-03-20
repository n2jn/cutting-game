/**
 * Pure 2D vector type and operations
 * No external dependencies - pure TypeScript
 */

export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Pure vector math operations
 * All functions are stateless and side-effect free
 */
export class Vector2DOperations {
  static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  static subtract(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static multiply(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar };
  }

  static divide(v: Vector2D, scalar: number): Vector2D {
    if (scalar === 0) {
      throw new Error('Division by zero');
    }
    return { x: v.x / scalar, y: v.y / scalar };
  }

  static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  static cross(a: Vector2D, b: Vector2D): number {
    return a.x * b.y - a.y * b.x;
  }

  static magnitude(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static magnitudeSquared(v: Vector2D): number {
    return v.x * v.x + v.y * v.y;
  }

  static normalize(v: Vector2D): Vector2D {
    const mag = this.magnitude(v);
    if (mag === 0) {
      return { x: 0, y: 0 };
    }
    return this.divide(v, mag);
  }

  static distance(a: Vector2D, b: Vector2D): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceSquared(a: Vector2D, b: Vector2D): number {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return dx * dx + dy * dy;
  }

  static rotate(v: Vector2D, angle: number): Vector2D {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: v.x * cos - v.y * sin,
      y: v.x * sin + v.y * cos,
    };
  }

  static angle(v: Vector2D): number {
    return Math.atan2(v.y, v.x);
  }

  static angleBetween(a: Vector2D, b: Vector2D): number {
    return Math.acos(this.dot(a, b) / (this.magnitude(a) * this.magnitude(b)));
  }

  static lerp(a: Vector2D, b: Vector2D, t: number): Vector2D {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
    };
  }

  static equals(a: Vector2D, b: Vector2D, epsilon = 0.0001): boolean {
    return (
      Math.abs(a.x - b.x) < epsilon &&
      Math.abs(a.y - b.y) < epsilon
    );
  }

  static zero(): Vector2D {
    return { x: 0, y: 0 };
  }

  static one(): Vector2D {
    return { x: 1, y: 1 };
  }

  static up(): Vector2D {
    return { x: 0, y: -1 };
  }

  static down(): Vector2D {
    return { x: 0, y: 1 };
  }

  static left(): Vector2D {
    return { x: -1, y: 0 };
  }

  static right(): Vector2D {
    return { x: 1, y: 0 };
  }
}
