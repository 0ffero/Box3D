var game = new Phaser.Game(consts.newConfig());
let Clamp = Phaser.Math.Clamp;
function preload() { vars.Phaser.scene=this; };
function create() { vars.App.start(); };
function update() { vars.App.box && vars.App.box.update(); vars.input.inputCheck(); };