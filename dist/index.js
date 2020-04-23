"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getRequestAnimationFrame = function () {
    var fixRequestAnimationFrame = function (callback) { window.setTimeout(callback, 1000 / 60); };
    return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || fixRequestAnimationFrame);
};
var Turntable = /** @class */ (function () {
    /**
     *
     * @param canvas canvas 元素
     * @param imageSrc 图片链接
     * @param startAngle 开始弧度
     * @param readyCallback 图片加载完成会调
     * @param rect canvas 的尺寸。置空则采用图片尺寸
     * @param isDev 是否开启开发者模式
     */
    function Turntable(canvas, imageSrc, startAngle, readyCallback, rect, isDev) {
        var _this = this;
        // 开发使用
        this.isDev = false;
        this.devFPS = 0;
        this.devLastTs = Date.now();
        // 正常属性
        this.lastTs = 0;
        this.endTs = 0;
        this.fristSecDist = 0;
        this.speed = 0;
        this.isStart = false;
        this.endAngle = -1;
        this.rotateAngle = 0;
        this.rotateTime = 0;
        this.startAngle = 0;
        this.ready = false;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.image = new Image();
        this.image.src = imageSrc;
        this.startAngle = startAngle;
        this.readyCallback = readyCallback;
        this.isDev = isDev;
        this.image.onload = function () { _this.load(rect); };
    }
    /**
     * 开始转动转盘
     * @param turnByRoundTime  转 1 圈所用时间(ms)
     */
    Turntable.prototype.start = function (turnByRoundTime) {
        if (!this.ready || this.isStart)
            return;
        this.reset();
        this.speed = 2 * Math.PI / (turnByRoundTime / 1000);
        this.isStart = true;
    };
    /**
     * stop 并不能马上把转盘停下来，只会慢慢减速停止。但在帧数稳定的情况下，会在 1 s 内结束
     * @param pos 期望转到 弧度
     * @param callback 停下后的回调
     */
    Turntable.prototype.stop = function (angle, callback) {
        // 已经设置了减速，动画没完成之前则不能再重新设置
        if (!this.ready || this.endAngle >= 0)
            return;
        this.callback = callback;
        this.endAngle = angle;
    };
    /**
     * 还原旋转角度
     */
    Turntable.prototype.resetCtxRotate = function () {
        this.ctx.restore();
        this.ctx.save();
        this.rotateAngle = 0;
    };
    Turntable.prototype.load = function (rect) {
        var _this = this;
        if (rect == null) {
            rect = { width: 0, height: 0 };
            rect.width = this.image.width;
            rect.height = this.image.height;
        }
        // 初始化尺寸
        this.canvas.width = rect.width * 2;
        this.canvas.height = rect.height * 2;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        var widthHalf = this.canvas.width * 0.5;
        var heightHalf = this.canvas.height * 0.5;
        this.translatePos = { width: widthHalf, height: heightHalf };
        // 定 形变圆心
        this.ctx.translate(widthHalf, heightHalf);
        // 定 速度 默认：转一圈用时 （1s）
        this.speed = 2 * Math.PI / 0.25;
        var myRequestAnimationFrame = getRequestAnimationFrame();
        var step = function () {
            var now = Date.now();
            var dist = _this.lastTs == null ? 0 : now - _this.lastTs;
            _this.lastTs = now;
            _this.render(dist);
            myRequestAnimationFrame(step);
            if (_this.isDev && document.getElementById('fps')) {
                _this.devFPS += 1;
                var timeDist = now - _this.devLastTs;
                if (timeDist >= 1000) {
                    _this.devLastTs = now;
                    document.getElementById('fps').innerHTML = _this.devFPS > 60 ? '60' : _this.devFPS + '';
                    _this.devFPS = 0;
                }
            }
        };
        myRequestAnimationFrame(step);
        this.ctx.rotate(this.startAngle);
        this.ctx.save();
        if (this.readyCallback) {
            this.ready = true;
            this.readyCallback();
        }
    };
    Turntable.prototype.allStop = function () {
        if (this.callback)
            this.callback();
        this.resetCtxRotate();
        this.ctx.rotate(this.endAngle);
        this.reset();
    };
    Turntable.prototype.reset = function () {
        this.endAngle = -1;
        this.endTs = 0;
        this.isStart = false;
        this.callback = null;
        this.rotateTime = 0;
        this.fristSecDist = 0;
    };
    Turntable.prototype.renderImage = function () {
        this.ctx.clearRect(-this.translatePos.width, -this.translatePos.height, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        this.ctx.fillRect(-this.translatePos.width, -this.translatePos.height, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.translatePos.width, -this.translatePos.height, this.canvas.width, this.canvas.height);
    };
    Turntable.prototype.render = function (ts) {
        this.renderImage();
        if (this.isStart) {
            this.rotateTime += ts;
            var speed = this.speed;
            // 前  1 S 速度   t * t * speed = nowSpeed
            if (this.rotateTime <= 1000) {
                speed = this.speed * (this.rotateTime / 1000) * (this.rotateTime / 1000);
            }
            else {
                if (this.fristSecDist == 0) {
                    this.fristSecDist = this.rotateAngle;
                }
                // 结束角度确定之后，开始减速
                if (this.endAngle >= 0 && this.endTs == 0) {
                    this.endTs = this.rotateTime + 1000;
                    this.resetCtxRotate();
                    this.ctx.rotate(this.endAngle - this.fristSecDist);
                }
                if (this.endTs > 0) {
                    // 最后 1 S 速度
                    var distT = (this.endTs - this.rotateTime);
                    speed = this.speed * (distT / 1000) * (distT / 1000);
                }
            }
            var angle = speed * (ts / 1000);
            this.rotateAngle += angle;
            if (this.isStart && this.endTs != 0) {
                if (this.rotateTime >= this.endTs || this.rotateAngle >= this.fristSecDist) {
                    // 判断这最后一下要不要加上
                    if ((this.rotateAngle - angle) < this.fristSecDist) {
                        angle = this.fristSecDist - (this.rotateAngle - angle);
                        this.rotateAngle += angle;
                    }
                    else {
                        this.allStop();
                    }
                }
            }
            if (!this.isStart)
                return;
            this.ctx.rotate(angle);
        }
    };
    return Turntable;
}());
exports.Turntable = Turntable;
