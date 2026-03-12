import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import decomp from 'poly-decomp';

// Set up concave polygon decomposition for Matter.js
Matter.Common.setDecomp(decomp);

export const engine = Matter.Engine.create();
export const world = engine.world;

export const { height, width } = Dimensions.get('window');
