import Matter from 'matter-js';

/**
 * JumpSystem
 *
 * Manages jump and gravity mechanics for platformer-style games
 * Controls duck jumping behavior with Matter.js physics
 */
export class JumpSystem {
  private duckBody: Matter.Body | null = null;
  private isGrounded: boolean = false;
  private jumpForce: number;
  private groundY: number;

  constructor(jumpForce: number = -15, groundY: number = 500) {
    this.jumpForce = jumpForce;
    this.groundY = groundY;
  }

  /**
   * Set the duck body to control
   */
  setDuckBody(body: Matter.Body): void {
    this.duckBody = body;
  }

  /**
   * Get duck body
   */
  getDuckBody(): Matter.Body | null {
    return this.duckBody;
  }

  /**
   * Check if duck is on the ground
   */
  getIsGrounded(): boolean {
    return this.isGrounded;
  }

  /**
   * Update grounded state based on duck position
   * Should be called every frame
   */
  update(): void {
    if (!this.duckBody) return;

    // Check if duck is at or near ground level
    this.isGrounded = this.duckBody.position.y >= this.groundY - 5;

    // Keep duck from falling through the ground
    if (this.duckBody.position.y > this.groundY) {
      Matter.Body.setPosition(this.duckBody, {
        x: this.duckBody.position.x,
        y: this.groundY,
      });
      Matter.Body.setVelocity(this.duckBody, {
        x: this.duckBody.velocity.x,
        y: 0,
      });
    }
  }

  /**
   * Make the duck jump
   * Only works if duck is grounded
   */
  jump(): boolean {
    if (!this.duckBody || !this.isGrounded) return false;

    // Apply upward force
    Matter.Body.setVelocity(this.duckBody, {
      x: this.duckBody.velocity.x,
      y: this.jumpForce,
    });

    this.isGrounded = false;
    return true;
  }

  /**
   * Set jump force
   */
  setJumpForce(force: number): void {
    this.jumpForce = force;
  }

  /**
   * Get jump force
   */
  getJumpForce(): number {
    return this.jumpForce;
  }

  /**
   * Set ground Y position
   */
  setGroundY(y: number): void {
    this.groundY = y;
  }

  /**
   * Get ground Y position
   */
  getGroundY(): number {
    return this.groundY;
  }

  /**
   * Reset jump system
   */
  reset(): void {
    if (this.duckBody) {
      Matter.Body.setPosition(this.duckBody, {
        x: this.duckBody.position.x,
        y: this.groundY,
      });
      Matter.Body.setVelocity(this.duckBody, { x: 0, y: 0 });
    }
    this.isGrounded = true;
  }
}
