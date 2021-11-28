import rect = require('./Rect');


function solveRectangle(x: number, y: number) {
    new rect(x, y, (err: Error, rectangle: rect) => {
        if (err) {
            console.log(`Error: ${err.message}`);
        } else {
            rectangle.solve();
        }
    })
}

solveRectangle(3, 2);
solveRectangle(3, 0);
