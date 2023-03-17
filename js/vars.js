var vars = {
    DEBUG: false,

    getScene: ()=> { return vars.Phaser.scene; },

    version: 1.11,

    // APP
    App: {
        box: null,
        connect: false,
        tracers: false,

        start: ()=> {
            vars.input.init();
            let aV = vars.App;
            aV.box = new Box();

            vars.UI.init();
        },
        tracersEnable: (_enable=true)=> {
            let aV = vars.App;
            if (_enable) {
                aV.box.boxContainer.removeAll(true);
                aV.tracers=true;
                return;
            };

            aV.tracers=false;
        }
    },

    input: {
        cursors: null,

        init: ()=> {
            let aV = vars.App;
            let scene = vars.getScene();
            let sIK = scene.input.keyboard;
            sIK.on('keyup', (_k)=> {
                let key = _k.key.toUpperCase();
                
                switch (key) {
                    case 'T':
                        aV.tracers = !aV.tracers;
                        aV.tracersEnable(aV.tracers);
                    break;
                    case 'V':
                        aV.box.changeType();
                    break;
                }
            });

            vars.input.cursors = sIK.createCursorKeys();
        },

        inputCheck: ()=> {
            if (!vars.input.cursors) return;
            let aV = vars.App;
            let cursors = vars.input.cursors
            if (cursors.right.isDown) { aV.box.rotationSpeedIncrease(); return; };
            if (cursors.left.isDown) { aV.box.rotationSpeedDecrease(); return; };
            if (cursors.up.isDown) { aV.box.containerIncreaseScale(); return; };
            if (cursors.down.isDown) { aV.box.containerDecreaseScale(); return; };
        }
    },

    Phaser: { scene: null },

    UI: {
        fonts: {
            version: { fontFamily: 'Consolas', fontSize: '20px', color: '#333333', align: 'right', lineSpacing: 2 },
            large: { fontFamily: 'Consolas', fontSize: '28px', color: '#ffffff', stroke: '#333333', strokeThickness: 2, align: 'center', lineSpacing: 10 }
        },
        text: {
            rotTitle: 'Use Left and Right Cursors to Increase or Decrease rotation speed',
            rotSpeed: 'Spinning [DIR] at [SPEED]',
            scaleText: 'Use Up and Down Cursors to Increase or Decrease box scale ([SCALE])',
            tracers: 'Press T to enable or disable tracers',
            box: 'Press V to swap between box and dots'
        },
        objects: { },
        init: ()=> {
            let cC = consts.canvas;
            let scene = vars.getScene();
            let UI = vars.UI;

            let fontL = UI.fonts.large;

            let msgs = UI.text;

            UI.objects.title = scene.add.text(cC.cX, cC.height*0.1, 'Faux 3D Box', { ...fontL, ... { fontSize: '42px' }}).setOrigin(0.5);
            let line1 = scene.add.text(cC.cX, cC.height*0.75, msgs.rotTitle, fontL).setOrigin(0.5);
            let line2 = scene.add.text(cC.cX, cC.height*0.80, msgs.rotSpeed.replace('[DIR]','RIGHT').replace('[SPEED]','5'), fontL).setOrigin(0.5);
            let line3 = scene.add.text(cC.cX, cC.height*0.85, msgs.scaleText.replace('[SCALE]','1'), fontL).setOrigin(0.5);

            let line4 = scene.add.text(cC.cX, cC.height*0.90, msgs.tracers, fontL).setOrigin(0.5);
            let line5 = scene.add.text(cC.cX, cC.height*0.95, msgs.box, fontL).setOrigin(0.5);

            UI.objects.instructions = {
                rTitle: line1,
                rSpeed: line2,
                sText: line3,
                tracers: line4,
                box: line5
            };

        },

        updateRSpeed: (_rotation)=> {
            let UI = vars.UI;

            let dir = _rotation.dir;
            let speed = _rotation.speed;
            let text = UI.text.rotSpeed.replace('[DIR]',dir).replace('[SPEED]',speed);
            UI.objects.instructions.rSpeed.setText(text);
        },
        updateSText: (_scale)=> {
            let UI = vars.UI;
            let text = UI.text.scaleText.replace('[SCALE]',_scale);
            UI.objects.instructions.sText.setText(text);
        }
    }

};