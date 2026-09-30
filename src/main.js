import { Game } from './core/Game.js';

const canvas = document.getElementById('gameCanvas');
const pauseMenu = document.getElementById('pauseMenu');

const game = new Game(canvas, pauseMenu);
game.start();
