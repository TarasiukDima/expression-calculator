function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let searchExpr = true;
    let arrayBrackets = expr
                            .match(/(\d)+|(\(|\)|\+|\-|\*|\/){1}/g)
                            .map(el => el.trim())
                            .filter(el => el !== '');

    while (searchExpr) {
        let startBrackets = arrayBrackets.lastIndexOf('(');
        let endBrackets = arrayBrackets.indexOf(')', startBrackets);
        let haveBrackets = arrayBrackets.indexOf(')');

        if (
            (startBrackets === -1 && haveBrackets > -1)
                ||
            (startBrackets > -1 && endBrackets === -1)
        ) {
            throw new Error('ExpressionError: Brackets must be paired');
        }

        if (startBrackets > -1 && endBrackets > -1) {
            let calcTotal = returnTotal(arrayBrackets.slice(startBrackets + 1, endBrackets));

            if (typeof(calcTotal) === 'string') return calcTotal;

            arrayBrackets = [
                ...arrayBrackets.slice(0, startBrackets),
                calcTotal,
                ...arrayBrackets.slice(endBrackets + 1)
            ]

            startBrackets = -1;
            endBrackets = -1;

        } else {
            while (arrayBrackets.length > 2) {
                arrayBrackets = [...calculateArray(arrayBrackets)];
            }
        }

        if (arrayBrackets.length === 1) searchExpr = false;
    }

    return arrayBrackets[0];
}

function returnTotal(arr) {
    if (arr.length === 0) return;
    if (arr.length === 1) return arr[0];

    let arrNew = [...arr];

    while (arrNew.length > 2) {
        arrNew = [...calculateArray(arrNew)]
    }

    return arrNew[0];
}

function calculateArray(arr) {
    let multiplyStart = arr.indexOf('*');
    let devideStart = arr.indexOf('/');
    let minusStart = arr.indexOf('-');
    let plusStart = arr.indexOf('+');


    if (multiplyStart > -1 && devideStart > -1) {

        if ( multiplyStart < devideStart ) {
            return calculateExpression(arr, multiplyStart, 'multiply');
        } else {
            return calculateExpression(arr, devideStart, 'devide');
        }

    } else if (multiplyStart > -1 || devideStart > -1) {

        if (multiplyStart > -1) return calculateExpression(arr, multiplyStart, 'multiply');
        if (devideStart > -1) return calculateExpression(arr, devideStart, 'devide');

    } else if (minusStart > -1 && plusStart > -1) {

        if ( minusStart < plusStart ) {
            return calculateExpression(arr, minusStart, 'minus');
        } else {
            return calculateExpression(arr, plusStart, 'plus');
        }

    } else if (minusStart > -1 || plusStart > -1) {

        if (minusStart > -1) return calculateExpression(arr, minusStart, 'minus');
        if ( plusStart > -1) return calculateExpression(arr, plusStart, 'plus');
    }

    return arr;
}

function calculateExpression(arr, start, action) {
    let newArr = [];
    let expression;

    switch (action) {
        case ('multiply'):
            expression = +arr[start - 1] * +arr[start + 1];
            break;
        case ('devide'):
            if (arr[start + 1] === '0') throw new Error('TypeError: Division by zero.');

            expression = +arr[start - 1] / +arr[start + 1];
            break;
        case ('plus'):
            expression = +arr[start - 1] + +arr[start + 1];
            break;
        case ('minus'):
            expression = +arr[start - 1] - +arr[start + 1];
            break;
    }

    newArr = [
        ...arr.slice(0, start - 1),
        expression,
        ...arr.slice(start + 2),
    ];

    return newArr;
}


module.exports = {
    expressionCalculator
}