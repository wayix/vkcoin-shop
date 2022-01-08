const control = {};

control.course = {
    buy: 1,
    sell: 2
}

control.edit = function(course, type) {
    control.course[type] = course;
}

module.exports = control