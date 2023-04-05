'use strict';

class Simulation
{
    /**
     * 
     * @param {Engine} engine 
     * @param {HTMLCanvasElement} topCanvas
     * @param {HTMLCanvasElement} sideCanvas
     * @param {Vector3} tableMeasures
     */
    constructor(engine, topCanvas, sideCanvas, tableMeasures)
    {
        this.Engine = engine;
        
        this.topCanvas = topCanvas;
        this.topCtx = this.topCanvas.getContext('2d');

        this.sideCanvas = sideCanvas;
        this.sideCtx = this.sideCanvas.getContext('2d');

        this.w = tableMeasures.x;
        this.l = tableMeasures.y;
        this.h = tableMeasures.z;
        this.center = tableMeasures.times(0.5).toNumbers();

        this.topCanvas.width = this.w.toNumber();
        this.topCanvas.height = this.l.toNumber();

        this.sideCanvas.width = this.topCanvas.width;
        this.sideCanvas.height = this.h.toNumber();

        this.TwoPi = 2 * Math.PI;

        this.RefreshCallback = () => { };
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} r 
     * @param {number} x 
     * @param {number} y 
     * @param {string} color 
     */
    #drawCircle(ctx, r, x, y, color)
    {
        cxt.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, r, 0, this.TwoPi);
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} p1x 
     * @param {number} p1y
     * @param {number} p2x 
     * @param {number} p2y 
     * @param {string} color 
     */
    #drawLine(ctx, p1x, p1y, p2x, p2y, color = '#000000')
    {
        ctx.strokeStyle = color;
        ctx.moveTo(p1x, p1y);
        ctx.lineWidth = 2;
        ctx.lineTo(p2x, p2y);
    }

    #drawTopView()
    {
        //Draws something like this
        /*****************************************
         *          _                            *
         *         / \                           *
         *        |   |                          *
         *         \ / \                         *
         *          -    \                       *
         *                 \                     *
         *                   \                   *
         *                    0                  * 
         *                                       *
         *                                       *
         *                                       *
         *                                       *
         *                                       *
         ****************************************/
        this.topCtx.fillStyle = '#ffffff';
        this.topCtx.clearRect(0, 0, this.topCanvas.width, this.topCanvas.height);
        const massPos = this.Engine.tableMass.position.toVec3().toNumbers();

        this.#drawLine(this.topCtx, this.center.x, this.center.y, massPos.x, massPos.y);
        this.#drawCircle(this.topCtx, 50, massPos.x, massPos.y, '#ff0000');
    }

    #drawSideView()
    {
        
        //Draws something like this
        /**************************************
         *####################################*
         *                |                   *
         *                |                   *
         *                |                   *
         *                |                   *
         *                |                   *
         *               / \                  *
         *              |   |                 * 
         *               \ /                  *
         *                                    *
         *                                    *
         *                                    *
         *                                    *
         **************************************/
        this.sideCtx.fillStyle = '#ffffff';
        this.sideCtx.clearRect(0, 0, this.sideCanvas.width, this.sideCanvas.height);
        const massPos = this.Engine.fallingMass.position.toNumbers();

        this.#drawLine(this.sideCtx, this.center.x, 0, massPos.x, -massPos.z);
        this.#drawCircle(this.sideCtx, 40, massPos.x, -massPos.z, '#00ff00');

        this.sideCtx.fillStyle = '#2f2312';
        this.sideCtx.fillRect(0, 0, this.sideCanvas.width, 10);
    }

    drawSimulation()
    {
        this.#drawTopView();
        this.#drawSideView();
    }

    executeIterations(num)
    {
        try {
            this.Engine.executeIterations(num);
        } catch (err) {
            warn(err);
            return false;
        }
        return true;
    }

    iterateAndDraw(num)
    {
        if (this.executeIterations(num))
        {
            this.drawSimulation();
        }
    }
    onRefresh(callback)
    {
        if (typeof callback !== 'function')
            return false;
        this.RefreshCallback = callback;
    }
    refresh()
    {
        try {
            this.RefreshCallback(this);
        } catch(err) {
            warn(err);
        }
    }

    /**
     * @returns {Decimal}
     */
    get dt() {
        return this.Engine.dt;
    }
    /**
     * @param {Decimal} value
     */
    set dt(value) {
        return this.Engine.dt = value;
    }

    /**
     * @returns {MassRotatingObject}
     */
    get tableMass() {
        return this.Engine.tableMass;
    }

    /**
     * @returns {MassFallingObject}
     */
    get fallingMass() {
        return this.Engine.fallingMass;
    }
}
