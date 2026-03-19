import { useState, useCallback, useRef, useEffect } from 'react';
import Matter from 'matter-js';
import { JumpSystem } from '../systems/JumpSystem';

/**
 * useJumpSystem Hook
 *
 * React hook wrapper for JumpSystem
 * Manages jump and gravity mechanics for platformer games
 */
export const useJumpSystem = (jumpForce: number = -15, groundY: number = 500) => {
  const systemRef = useRef<JumpSystem | null>(null);
  const [, forceUpdate] = useState({});

  // Initialize system once
  if (!systemRef.current) {
    systemRef.current = new JumpSystem(jumpForce, groundY);
  }

  const system = systemRef.current;

  /**
   * Set the duck body to control
   */
  const setDuckBody = useCallback(
    (body: Matter.Body) => {
      system.setDuckBody(body);
      forceUpdate({});
    },
    [system]
  );

  /**
   * Make the duck jump
   */
  const jump = useCallback(() => {
    const jumped = system.jump();
    forceUpdate({});
    return jumped;
  }, [system]);

  /**
   * Update jump system (should be called every frame)
   */
  const update = useCallback(() => {
    system.update();
    forceUpdate({});
  }, [system]);

  /**
   * Reset jump system
   */
  const reset = useCallback(() => {
    system.reset();
    forceUpdate({});
  }, [system]);

  return {
    isGrounded: system.getIsGrounded(),
    duckBody: system.getDuckBody(),
    jumpForce: system.getJumpForce(),
    groundY: system.getGroundY(),
    setDuckBody,
    jump,
    update,
    reset,
  };
};
