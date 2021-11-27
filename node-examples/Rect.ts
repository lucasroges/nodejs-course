class Rect {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        if (x <= 0 || y <= 0) {
            throw new Error("Rectangle dimensions should be greater than zero.");
        }
        this.x = x;
        this.y = y;
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