var Game = function () {
    this.elem = {
        stage: document.getElementById("stage"),
        bg: document.getElementById("bg"),
        man: document.getElementById("man"),
        ling: document.getElementById("ling"),
        lingimg: document.getElementById("lingimg"),
        bt: document.getElementById("bt"),
        light: document.getElementById("light"),
        progressbar: document.getElementById("progressbar"),
        bar: document.getElementById("bar"),
        powerbg: document.getElementById("powerbg"),
        start: document.getElementById("start"),
        send: document.getElementById("send"),
        score: document.getElementById("score").getElementsByTagName("strong")[0]

    };
    this.progressObj = {
        t: null,
        value: 5
    };
    this.canFire = true;
    this.init();
};

Game.prototype = {
    init: function () {
        var me = this;
        var light = me.spriteLight();
        light.animation();
        this.elem.start.onclick = function () {
            this.style.display = "none";
            me.elem.progressbar.style.display = "block";
            me.elem.powerbg.style.display = "block";
            me.progress();
            me.initShake();
            light.animationStop();
        };
        this.elem.send.onclick = function () {
            me.fireStart();
        };
    },
    initShake: function () {
        var me = this;
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        }else{
            me.elem.send.style.display="block";
            me.elem.powerbg.style.display="none";
        }

        var SHAKE_THRESHOLD = 2000;
        var last_update = 0;
        var x, y, z, last_x, last_y, last_z;

        function deviceMotionHandler(eventData) {
            var acceleration = eventData.accelerationIncludingGravity;
            var curTime = new Date().getTime();
            if ((curTime - last_update) > 100) {
                var diffTime = curTime - last_update;
                last_update = curTime;

                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;

                var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

                if (speed > SHAKE_THRESHOLD) {
                    me.fireStart();
                }
                last_x = x;
                last_y = y;
                last_z = z;
            }
        }
    },
    spriteLight :function(){
        var light = new Sprite({
            elem:this.elem.light,
            fps:100,
            count:15,
            image:{
                width:750,
                height:450
            },
            frames:{
                width:150,
                height:150
            }
        });
        return light;
    },
    spriteLingImg :function(){
        var light = new Sprite({
            elem:this.elem.lingimg,
            fps:100,
            count:16,
            image:{
                width:800,
                height:800
            },
            frames:{
                width:200,
                height:200
            }
        });
        return light;
    },

    progress: function () {
        var me = this;
        var bar = this.elem.bar;
        var toogle = false;
        me.progressObj.t = setInterval(function () {
            if (me.progressObj.value > 100) {
                toogle = true;
            }else if(me.progressObj.value < 5){
                toogle = false;
            }
            if(toogle){
                me.progressObj.value --;
            }else{
                me.progressObj.value ++;
            }
            bar.style.width = me.progressObj.value + "%";
        }, 20);
    },
    progressStop: function () {
        clearInterval(this.progressObj.t);
    },
    fire: function (x, y, a, t) {
        var me = this;
        me.canFire = false;
        var Vx = x,
            Vy = parseInt(y),
            g = a,
            t = parseInt(t),
            h = 0,
            l = 0,
            Sx = 0,
            Sy = 0,
            vb = 0;

        var i = setInterval(function () {
            vb -= 1;
            Sx += Vx * t;
            l = parseInt(Sx,10);
            Vy += g * t;
            h += Vy * t;
            me.elem.ling.style.left = l + 'px';
            me.elem.ling.style.top = h - Vy + 'px';
            me.elem.stage.style.left = -l + 'px';
            me.elem.bg.style.left = vb + 'px';
            me.elem.score.innerHTML = l;
            if (h >= -2) {
                Vy *= (Vy > 1) ? -0.6 : 0;
                if (Vy == 0) {
                    clearInterval(i);
                    setTimeout(function(){
                        me.gameOver();
                    },1000);
                }
            }
        }, t);

    },
    fireStart: function () {
        if(!this.canFire) return;
        this.elem.ling.style.display = "block";
        this.elem.score.parentNode.style.display = "block";
        var lingimg = this.spriteLingImg();
        lingimg.animation();
        this.progressStop();
        var vx = this.progressObj.value / 5;
        this.fire(vx, -3, 0.0098, 2);
    },
    gameOver:function(){
        var s = this.elem.score.innerHTML;
        var c = confirm("您传令距离为"+s+"米，再试一次?");
        if(c){
            location.reload();
        }
    }
};


var Sprite = function(obj){
    this.elem = obj.elem;
    this.image = obj.image;
    this.frames = obj.frames;
    this.count = obj.count;
    this.regX = obj.regX;
    this.regY = obj.regY;
    this.fps = obj.fps;
    this.once = obj.once || false;
    this.t = null;
};

Sprite.prototype = {
    arrframes:function(){
        var res = [];
        var x = this.image.width/this.frames.width;
        var y = this.image.height/this.frames.height;
        for(var i =0;i<x;i++){
            for(var j =0;j<y;j++){
                var obj = {};
                obj.x = - i * this.frames.width;
                obj.y = - j * this.frames.height;
                res.push(obj);
            }
        }

        return res;
    },
    animation:function(){
        var me = this;
        var arr = this.arrframes();
        var n = 0;
        this.t = setInterval(function(){
            if(me.once && n >= me.count-1) clearInterval(me.t);
            if(n > me.count - 1) n = 0;
            me.elem.style.backgroundPositionX = arr[n].x + "px";
            me.elem.style.backgroundPositionY = arr[n].y + "px";
            n ++;
        },me.fps);
    },
    animationStop:function(){
        clearInterval(this.t);
    }
};

new Game();
