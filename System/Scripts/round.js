function round( num, digits ) {
    return Math.round((num + Number.EPSILON) * Math.pow(10, digits)) / Math.pow(10, digits);
}

module.exports = round;