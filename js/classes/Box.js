"use strict"
let Box = class {
    constructor() {
        this.cC = consts.canvas;
        this.scene = vars.getScene();

        this.preInit();

        this.angleInc = 0.05;
        this.xMult = 100; this.yMult=30;
        this.boxContainer = this.scene.add.container();
        this.boxContainer.setPosition(this.cC.cX,this.cC.cY-100);
        this.containerScale = 1;

        this.graphics = this.scene.add.graphics().setDepth(5);

        this.box = false;
        this.triangulate = false;

        this.init();
    }

    preInit() {
        let scene = this.scene;

        this.circumference = 20;
        
        // generate the dots image
        var graphics = this.graphics = scene.add.graphics();
        graphics.fillStyle(0xdddddd, 1);
        graphics.beginPath();
        graphics.arc(10, 10, 10, 0, Math.PI*2, false, 0.01);
        graphics.fillPath();
        graphics.closePath();

        graphics.generateTexture('circle', this.circumference, this.circumference);
        graphics.clear();
    }

    init() {
        this.generateBox();
    }

    changeType() {
        if (!this.box) { this.box=true; return; };
        if (!this.triangulate) { this.triangulate=true; return; };
        this.box = false;
        this.triangulate = false;
    }

    containerDecreaseScale() {
        this.containerScale-=0.01;
        this.containerScaleClamp();
        this.containerSetScale();
    }
    containerIncreaseScale() {
        this.containerScale+=0.01;
        this.containerScaleClamp();
        this.containerSetScale();
    }
    containerScaleClamp() {
        this.containerScale = Clamp(this.containerScale,0.5,3);
    }
    containerSetScale() {
        this.boxContainer.setScale(this.containerScale);
        vars.UI.updateSText((this.containerScale*100|0)/100);
    }

    drawLines() {
        let graphics = this.graphics;
        graphics.clear();

        if (!this.box) return;
        let xOff = this.boxContainer.x;
        let yOff = this.boxContainer.y;


        let uppers = [];
        let lowers = [];
        
        // DOTS
        this.points.forEach((_p)=> {
            let upper = _p.images.upper;
            let lower = _p.images.lower;
            
            let from = { x: upper.x+xOff, y: upper.y+yOff }; uppers.push(from);
            let to   = { x: lower.x+xOff, y: lower.y+yOff }; lowers.push(to);
            
            let scale = this.circumference * _p.scale;
            graphics.lineStyle(this.box ? 5 : scale, 0xcccccc);
            graphics.beginPath();
            graphics.moveTo(from.x, from.y);
            graphics.lineTo(to.x, to.y);
    
            graphics.closePath();
            graphics.strokePath();
        });

        // LINES
        uppers.forEach((_xy,_i)=> {
            graphics.lineStyle(5, 0xcccccc);

            graphics.beginPath();
            graphics.moveTo(_xy.x, _xy.y);

            // where are we going to?
            let to = (_i===3) ? uppers[0] : uppers[_i+1];
            graphics.lineTo(to.x, to.y);

            if (!_i && this.triangulate) {;
                let t = uppers[2];
                graphics.lineTo(t.x, t.y);
            };
    
            graphics.closePath();
            graphics.strokePath();
        });

        lowers.forEach((_xy,_i)=> {
            graphics.lineStyle(5, 0xcccccc);

            graphics.beginPath();
            graphics.moveTo(_xy.x, _xy.y);

            // where are we going to?
            let to = (_i===3) ? lowers[0] : lowers[_i+1];
            graphics.lineTo(to.x, to.y);

            if (!_i && this.triangulate) {;
                let t = lowers[2];
                graphics.lineTo(t.x, t.y);
            };
    
            graphics.closePath();
            graphics.strokePath();
        });

        if (!this.triangulate) return;

        lowers.forEach((_xy,_i)=> {
            graphics.lineStyle(5, 0xcccccc);

            graphics.beginPath();
            graphics.moveTo(_xy.x, _xy.y);

            // where are we going to?
            let to = (_i===3) ? uppers[0] : uppers[_i+1];
            graphics.lineTo(to.x, to.y);
    
            graphics.closePath();
            graphics.strokePath();
        });
        //debugger;
    }

    drawPoints() {
        // before deciding to add tracers, the 2 position images were being added
        // to the points object as they were just going to be moved and not redrawn.
        // To add tracers Im creating a new image that fades out over time
        // This is obviously more CPU intensive, but my gateway pc, with an iGPU
        // still managed to easily hit 60fps. So, the destroy and redraw stays
        let scene = this.scene;
        let bC = this.boxContainer;
        let tracers = vars.App.tracers;
        (!tracers && bC.count()) && bC.removeAll(true);

        let alpha = this.box ? 0 : 1;
        this.points.forEach((_p,_i)=> {
            let scale = (_p.y+this.yMult)/(this.yMult*2)+0.5;
            this.points[_i].scale = scale;
            let l = (((_p.z+1)/2*60|0)+20)/100;
            let colour = Phaser.Display.Color.HSLToColor(0,0,l).color;
            //console.log(colour);
            let c = scene.add.image(_p.x,_p.y-60,'circle').setScale(scale).setTint(colour).setAlpha(alpha);
            let c2 = scene.add.image(_p.x,_p.y+60,'circle').setScale(scale).setTint(colour).setAlpha(alpha);

            if (tracers && !this.box) {
                c.tween = scene.tweens.add({
                    targets: [c,c2], alpha: 0, duration: 100,
                    onComplete: ()=> { c.destroy(); }
                });
            };
            _p.images.upper = c;
            _p.images.lower = c2;
            bC.add([c,c2]); // put the image into the container
        });

        this.drawLines();
    }

    generateBox() {
        this.points = [];

        let angle = 0;
        while (angle<Math.PI*2) {
            let x = Math.sin(angle);
            let y = Math.cos(angle);
            
            x*=this.xMult;
            y*=this.yMult;
            let z = y/this.yMult;

            let point = { angle: angle, x: x, y: y, z: z, images: { upper: null, lower: null }};

            this.points.push(point);

            angle+=Math.PI/2;
        };

        this.drawPoints();
    }

    rotationSpeedClamp() {
        this.angleInc = Clamp(this.angleInc,-0.1,0.1);
    }
    rotationSpeedDecrease() {
        this.angleInc-=0.002;
        this.rotationSpeedClamp();

        let dir = !this.angleInc ? 'STOPPED' : this.angleInc>0 ? 'RIGHT' : 'LEFT';
        let speed = dir==='STOPPED' ? 0 : dir==='LEFT' ? this.angleInc*-1 : this.angleInc;
        vars.UI.updateRSpeed({dir: dir, speed: (speed*1000|0)/10 });
    }
    rotationSpeedIncrease() {
        this.angleInc+=0.002;
        this.rotationSpeedClamp();

        let dir = !this.angleInc ? 'STOPPED' : this.angleInc>0 ? 'RIGHT' : 'LEFT';
        let speed = dir==='STOPPED' ? 0 : dir==='LEFT' ? this.angleInc*-1 : this.angleInc;
        vars.UI.updateRSpeed({dir: dir, speed: (speed*1000|0)/10 });
    }

    update() {
        this.points.forEach((_p)=> {
            _p.angle+=this.angleInc;
            let a = _p.angle;
            let maxA = Math.PI*2; a>maxA && (_p.angle-=maxA);
            let x = Math.sin(a); let y = Math.cos(a);
            
            x*=this.xMult;
            y*=this.yMult;
            let z = y/this.yMult;
            _p.x = x; _p.y = y; _p.z=z;
        });

        this.drawPoints();
    }
};