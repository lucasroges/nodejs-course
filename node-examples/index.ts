import rect = require('./Rect');

try {
    const rectangle = new rect(0, 3);
    rectangle.solve();
} catch (e: any) {
    console.log(`Error: ${e.message}`);
}

