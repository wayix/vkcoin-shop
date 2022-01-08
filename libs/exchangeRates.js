const control = {};

control.course = {
    buy: 1, // Курс покупки
    sell: 2.5 // Курс продажи
}

control.edit = function(type, course) {
    control.course[type] = Number(course);
}

module.exports = control