class Rect {

    x: number;
    y: number;

    constructor(x: number, y: number, callback: Function) {
        if (x <= 0 || y <= 0) {
            setTimeout(() => callback(new Error(`Rectangle dimensions should be greater than zero. Dimensions: ${x} and ${y}`), null), 2000);
        } else {
            this.x = x;
            this.y = y;
            setTimeout(() => callback(null, this), 2000);
        }
        //console.log('constructor finished');
    }

    perimeter = () => (2 * (this.x + this.y))

    area = () => (this.x * this.y)

    solve = () => {
        const rectPerimeter = this.perimeter();
        const rectArea = this.area();
        console.log(`The perimeter of the rectangle is ${rectPerimeter}`);
        console.log(`The area of the rectangle is ${rectArea}`);
    }
};

export = Rect;