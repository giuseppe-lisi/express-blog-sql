// gets time at which request was made 
// and prints to console

function reqTime(req, res, next) {
    const date = new Date();
    console.log(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`);

    next();
}

module.exports = reqTime;