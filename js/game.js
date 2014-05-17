var Game = function () {
    this.elem = {
        stage: document.getElementById("stage"),
        bg: document.getElementById("bg"),
        man: document.getElementById("man"),
        ling: document.getElementById("ling"),
        bt: document.getElementById("bt"),
        progressbar: document.getElementById("progressbar"),
        bar: document.getElementById("bar"),
        powerbg: document.getElementById("powerbg"),
        start: document.getElementById("start"),
    };
    this.progressObj = {
        t: null,
        value: 5
    };
    this.init();
};

Game.prototype = {
    init: function () {
        var me = this;
        this.elem.start.onclick = function () {
            this.style.display = "none";
            me.elem.progressbar.style.display = "block";
            me.elem.powerbg.style.display = "block";
            me.progress();
            me.initShake();
        }
    },
    initShake: function () {
        var me = this;
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', deviceMotionHandler, false);
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
    progress: function () {
        var me = this;
        var bar = this.elem.bar;
        me.progressObj.t = setInterval(function () {
            if (me.progressObj.value > 100) {
                me.progressObj.value = 5;
            }
            bar.style.width = me.progressObj.value + "%";
            me.progressObj.value += 1;
        }, 20);
    },
    progressStop: function () {
        clearInterval(this.progressObj.t);
    },
    fire: function (x, y, a, t) {
        var me = this;
        var Vx = x,
            Vy = parseInt(y),
            g = a,
            t = parseInt(t),
            h = 0,
            l = 0,
            Sx = 0,
            Sy = 0;

        var bb = 0;
        // console.log('Vx:'+Vx+' Vy:'+Vy+' g:'+g+' t:'+t+' h:'+h+' l:'+l+' Sx:'+Sx+' Sy:'+Sy);
        var i = setInterval(function () {
            bb -= 1;
            Sx += Vx * t;
            l = Sx;
            Vy += g * t;
            h += Vy * t;
            //console.log('X轴:'+l+'    Y轴:'+h+'   Vy:'+Vy);
            me.elem.ling.style.left = l + 'px';
            me.elem.ling.style.top = h - Vy + 'px';
            me.elem.stage.style.left = -l + 'px';
            me.elem.bg.style.left = bb + 'px';
            if (h >= -2) {
                Vy *= (Vy > 1) ? -0.6 : 0;
                if (Vy == 0) clearInterval(i);
            }
        }, t);

    },
    fireStart: function () {
        this.elem.ling.style.display = "block";
        this.progressStop();
        var vx = this.progressObj.value / 5;
        this.fire(vx, -3, 0.0098, 1);
    }
};


new Game();
var l = document.getElementById("light");
var img = document.getElementById("lingimg");
var i = 1;
var n = setInterval(function () {
    //console.info(i)
    if (i > 15) i = 1;
    l.style.backgroundImage = "url('../images/gif2/" + i + ".png')";
    img.style.backgroundImage = "url('../images/gif3/" + i + ".png')";
    i++;
}, 100);