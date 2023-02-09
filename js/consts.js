const consts = {
    appName: 'Flags',
    canvas: {
		colour: '#111111',
		width: 1920, height: 1080,
        cX: 1920/2, cY: 1080/2
	},

	newConfig: ()=> {
		return {
			title: "Box3D by 0ffero",
			url: window.location.href,
			version: vars.version,
			type: Phaser.WEBGL,
			backgroundColor: '#111111',
			disableContextMenu: true,
			height: consts.canvas.height,
			width: consts.canvas.width,
			scale: {
				mode: Phaser.Scale.FIT,
				autoCenter: Phaser.Scale.CENTER_BOTH,
				width: consts.canvas.width,
				height: consts.canvas.height,
			},
			scene: { preload: preload, create: create, update: update }
		};
	}
};