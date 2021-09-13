let alg = 0;
let op = '';
const algL = document.querySelector('#algL')
const algR = document.querySelector('#algR')
let neg = false;
const equation = document.getElementById('equation');
let startNum = Math.floor(Math.random() * 20) - 10

let leftSide = 'x'
let rightSideNumerator = startNum
let rightSideDenominator = 1
let rightSide = ''
equation.textContent = `$$${leftSide}=${startNum}$$`
const helpPad = document.getElementById('helpPad')
const randoBut = document.createElement('button')
randoBut.id = 'randoBut'
randoBut.textContent = 'New'
helpPad.appendChild(randoBut)

let stepsText = []
const stepsTextList = document.getElementById('steps')

let steps = [['base', startNum]];

for (let i = 0; i <= 9; i++) {
    const numBut = document.createElement('button');
    numBut.id = (i + 1 > 9) ? 0 : i + 1
    numBut.textContent = `${numBut.id}`
    numBut.addEventListener('click', (event) => {
        if (op && Math.log10(Math.abs(alg)) <= 4) {
            alg = alg * 10 + (neg ? -parseInt(event.target.textContent) : parseInt(event.target.textContent))
            algL.textContent = `${op}${alg}`
            alsoR()
        }
    })
    numBut.classList.add('homoBut')
    document.querySelector('#numPad').appendChild(numBut);
}


function alsoR() {
    algR.textContent = algL.textContent
}

const operators = ["+", "-", "×", "÷"]

for (let i = 0; i < 4; i++) {
    const opBut = document.createElement('button')
    opBut.textContent = operators[i];
    opBut.id = operators[i]
    opBut.addEventListener('click', (event) => {
        op = event.target.textContent
        algL.textContent = op
        alsoR()
        alg = 0
        neg = false
    })
    opBut.classList.add('homoBut')
    document.querySelector('#opPad').appendChild(opBut)
}

const delBut = document.createElement('button');
delBut.textContent = 'del'
delBut.id = 'delBut'

delBut.addEventListener('click', (event) => {
    if (!op) {
        //do nothing
    } else if (!neg && alg === 0) {
        algL.textContent = ""
        op = ''
    } else if (neg && alg === 0) {
        algL.textContent = op;
        neg = false;
    } else if (!neg && alg !== 0) {
        alg = (alg - alg%10) / 10
        if (alg === 0) {
            algL.textContent = `${op}`
        } else {
            algL.textContent = `${op}${alg}`
        } 
    } else if (neg && alg !== 0) {
        alg = (alg - alg%10) / 10
        if (alg === 0) {
            algL.textContent = `${op}-`
        } else {
            algL.textContent = `${op}${alg}`
        } 
    }
    alsoR()
})
delBut.classList.add('homoBut')
document.querySelector('#numPad').appendChild(delBut);

const negBut = document.createElement('button')
negBut.classList.add('homoBut')
negBut.textContent = '(-)'
negBut.id = 'negBut'
negBut.addEventListener('click', (event) => {
    if (op) {
        neg = !neg
        if (alg !== 0) {
            alg = alg * -1
            algL.textContent = `${op}${alg}`
            
        } else {
            if (neg) {
                algL.textContent = `${op}-`
            } else {
                algL.textContent = `${op}`
            }
        }
        alsoR()
    }
})

document.querySelector('#numPad').appendChild(negBut);

const enterBut = document.createElement('button')
enterBut.textContent = 'Enter'
enterBut.id = 'enterBut'

document.querySelector('#keyPad').appendChild(enterBut);

function gcf(a, b) {
    if (a === 0) {
        return b
    }
    for (let i = Math.min(Math.abs(a), Math.abs(b)); i >=1; i--) {
        if (Math.abs(a) % i === 0 && Math.abs(b) % i === 0) {
            return i
        }
    }
}

function simpRight() {
    const GCF = gcf(rightSideNumerator, rightSideDenominator)
    rightSideNumerator /= GCF
    rightSideDenominator /= GCF
    if (rightSideNumerator / rightSideDenominator >= 0) {
        rightSideDenominator = Math.abs(rightSideDenominator)
        rightSideNumerator = Math.abs(rightSideNumerator)
    } else {
        rightSideDenominator = Math.abs(rightSideDenominator)
        rightSideNumerator = -Math.abs(rightSideNumerator)
    }
    if (rightSideDenominator === 1) {
        rightSide = `${rightSideNumerator}`
    } else {
        rightSide = `\\frac{${rightSideNumerator}}{${rightSideDenominator}}`
    }
}


// THESE FUNCTIONS SHOULD BE RUN !!AFTER!! SIMPLIFYING

function updateLeftDenom(a) {
    const lastLBrace = leftSide.lastIndexOf('{')
    leftSide = leftSide.substring(0,lastLBrace) + `{${a}}`
}

function updateLeftNumerFrac(a) {
    leftSide = leftSide.substring(0,6) + `${a}` + leftSide.substring(leftSide.substring(6).search(/[^\d\-]/)+6)
}

function updateLeftNoFrac(a) {
    leftSide = `${a}` + leftSide.substring(leftSide.search(/[^\d\-]/))
}

function addParenthesesToLeftNumer(a) {
    leftSide = leftSide.substring(0,6) + `${a}\\left(` + leftSide.substring(6,leftSide.lastIndexOf('{')-1) + `\\right)}${leftSide.substring(leftSide.lastIndexOf('{'))}`
    steps.push(['multi', a])
}

function addFrac(a) {
    leftSide = '\\frac{' + leftSide + `}{${a}}`
    steps.push(['div', a])
}

function removeParenthesesFrac() {
    leftSide = '\\frac{' + leftSide.substring(leftSide.indexOf('(')+1, leftSide.lastIndexOf('\\right)')) + '}' + leftSide.substring(leftSide.lastIndexOf('{'))
    for (let i = steps.length-1; i >= 0; i--) {
        if (steps[i][0] === 'multi') {
            steps.splice(i, 1)
            break
        }
    }
}

function removeParenthesesNoFrac() {
    leftSide = leftSide.substring(leftSide.indexOf('(')+1, leftSide.lastIndexOf('\\right)'))
    for (let i = steps.length-1; i >= 0; i--) {
        if (steps[i][0] === 'multi') {
            steps.splice(i, 1)
            break
        }
    }
}

function removeFrac() {
    leftSide = leftSide.substring(6,leftSide.lastIndexOf('{')-1)
    for (let i = steps.length-1; i >= 0; i--) {
        if (steps[i][0] === 'div') {
            steps.splice(i, 1)
            break
        }
    }
}

function simpLeft(multi, div) {
    const GCF = gcf(multi, div)
    steps[steps.length-1][1] /= GCF
    steps[steps.length-2][1] /= GCF
    const searchSteps = (input, arr) => {
        for (let i = arr.length-1; i >= 0; i--) {
            if (arr[i][0] === input) {
                return i
            }
        }
    }
    multiIndex = searchSteps('multi', steps)
    divIndex = searchSteps('div', steps)
    let killed = false
    if (steps[multiIndex][1] / steps[divIndex][1] >= 0) {
        steps[divIndex][1] = Math.abs(steps[divIndex][1])
        steps[multiIndex][1] = Math.abs(steps[multiIndex][1])
    } else {
        steps[divIndex][1] = Math.abs(steps[divIndex][1])
        steps[multiIndex][1] = -Math.abs(steps[multiIndex][1])
    }
    if (steps[multiIndex][1] === 1) {
        if (steps[steps.length-3][0] === 'base') {
            leftSide = `\\frac{x}{${steps[divIndex][1]}}`
            steps.splice(multiIndex, 1)
        } else {
            removeParenthesesFrac()
            updateLeftDenom(steps[steps.length-1][1])
        }
        if (multiIndex < divIndex) divIndex--
        killed = true
    }
    if (steps[divIndex][1] === 1) {
        removeFrac()
        if (steps[steps.length-1][0] === 'multi') updateLeftNoFrac(steps[steps.length-1][1])
        killed = true
    }
    if (!killed) {
        updateLeftDenom(steps[divIndex][1])
        updateLeftNumerFrac(steps[multiIndex][1])
    }
}

let undoList = []

function doMath() {
    if (op && alg !== 0 ) {
        if (op === '+' || op === '-') { // ADDITION - SUBTRACTION
            rightSideNumerator += (op === '+' ? alg : -alg) * rightSideDenominator
            if (steps[steps.length-1][0] === 'addsub') {
                const spacesToDelete = Math.floor(Math.log10(Math.abs(steps[steps.length-1][1]))) + 2
                steps[steps.length-1][1] += (op === '+' ? alg : -alg)
                leftSide = leftSide.substring(0, leftSide.length - spacesToDelete)
                if (steps[steps.length-1][1] === 0) {
                    steps.pop()
                } else {
                    leftSide += (steps[steps.length-1][1] > 0 ? `+` : '') + `${steps[steps.length-1][1]}`
                } 
            } else {
                steps.push(['addsub', (op === '+' ? alg : -alg)])
                leftSide += (steps[steps.length-1][1] > 0 ? `+` : '') + `${steps[steps.length-1][1]}`
            }
        } else if (op === '×' && alg !== 1) { // MULTIPLICATION
            rightSideNumerator *= alg
            if (steps[steps.length-1][0] === 'addsub') {
                leftSide = `${alg}\\left(${leftSide}\\right)`
                steps.push(['multi', alg])
            } else if (steps[steps.length-1][0] === 'multi') {
                if (steps[steps.length-2][0] === 'div') {
                    steps[steps.length-1][1] *= alg
                    simpLeft(steps[steps.length-1][1], steps[steps.length-2][1])
                } else {
                    steps[steps.length-1][1] *= alg
                    updateLeftNoFrac(steps[steps.length-1][1])
                    if (steps[steps.length-1][1] === 1) steps.pop()
                }
            } else if (steps[steps.length-1][0] === 'div') {
                if (steps[steps.length-2][0] === 'addsub') {
                    addParenthesesToLeftNumer(alg)
                    simpLeft(steps[steps.length-1][1], steps[steps.length-2][1])
                } else if (steps[steps.length-2][0] === 'multi') {
                    steps[steps.length-2][1] *= alg
                    simpLeft(steps[steps.length-2][1], steps[steps.length-1][1])
                } else {
                    steps.push(['multi', alg])
                    leftSide = leftSide.substring(0,6) + `${alg}` +  leftSide.substring(6)
                    simpLeft(steps[steps.length-1][1], steps[steps.length-2][1])
                }
            } else {
                leftSide = `${alg}` + leftSide
                steps.push(['multi', alg])
            }
        } else if (op === '÷' && alg !== 1) { // DIVISION
            rightSideDenominator *= alg
            if (steps[steps.length-1][0] === 'multi') {
                if (steps[steps.length-2][0] === 'div') {
                    steps[steps.length-2][1] *= alg
                    simpLeft(steps[steps.length-1][1], steps[steps.length-2][1])
                } else {
                    addFrac(alg)
                    simpLeft(steps[steps.length-2][1], steps[steps.length-1][1])
                }
            } else if (steps[steps.length-1][0] === 'div') {
                if (steps[steps.length-2][0] === 'multi') {
                    steps[steps.length-1][1] *= alg
                    simpLeft(steps[steps.length-2][1], steps[steps.length-1][1])
                } else {
                    steps[steps.length-1][1] *= alg
                    updateLeftDenom(steps[steps.length-1][1])
                } 
            } else {
                leftSide = `\\frac{${leftSide}}{${alg}}`
                steps.push(['div', alg])
            }

        }
    }
    simpRight()
    if (steps.length === 1) leftSide = 'x'
    equation.textContent = `$$${leftSide}=${rightSide}$$`
    alg = 0
    op = ''
    algL.textContent = ''
    alsoR()
}

function clearHints() {
    document.getElementById('opPad').childNodes.forEach(elem => {
        if (elem.classList.contains('hintColor')) {
            elem.classList.remove('hintColor')
        }
    })
}

enterBut.addEventListener('click', () => {
    const newStep = document.createElement('li')
    if (op === '+') {
        stepsText.push(`You added ${alg} to both sides.`)
        undoList.push(['-', alg])
    } else if (op === '-') {
        stepsText.push(`You subtracted ${alg} from both sides.`)
        undoList.push(['+', alg])
    } else if (op === '×') {
        stepsText.push(`You multiplied both sides by ${alg}.`)
        undoList.push(['÷', alg])
    } else if (op === '÷') {
        stepsText.push(`You divided by ${alg} on both sides.`)
        undoList.push(['×', alg])
    }
    clearHints()
    doMath()
    MathJax.typeset()
    newStep.textContent = stepsText[stepsText.length-1]
    stepsTextList.appendChild(newStep)
})

function randoProb(diff) {
    while (steps.length <= diff) {
        let opNum = Math.floor(Math.random() * 4)
        op = operators[opNum]
        alg = Math.floor(Math.random()*20-10)
        doMath()
    }
}

randoProb(3)

function newProb() {
    clearHints()
    undoList = []
    newNum = Math.floor(Math.random()*20-10)
    equation.textContent = `$$x=${newNum}$$`
    leftSide = 'x'
    rightSideDenominator = 1
    rightSideNumerator = newNum
    steps = [['base', newNum]]
    randoProb(3)
    stepsText = []
    while (stepsTextList.firstElementChild) {
        stepsTextList.firstElementChild.remove()
    }
    MathJax.typeset()
}

randoBut.addEventListener('click', newProb)

const hintBut = document.createElement('button')
hintBut.textContent = "Hint"
hintBut.id = 'hintBut'
hintBut.classList.add('homoBut')
helpPad.appendChild(hintBut)

function getHint() {
    const lastStep = steps[steps.length-1]
    if (lastStep[0] === 'addsub') {
        if (lastStep[1] > 0) {
            document.getElementById('-').classList.add('hintColor')
        } else {
            document.getElementById('+').classList.add('hintColor')
        }
    } else if (lastStep[0] === 'multi') {
        document.getElementById('÷').classList.add('hintColor')
    } else if (lastStep[0] === 'div') {
        document.getElementById('×').classList.add('hintColor')
    }
}

hintBut.addEventListener('click', getHint)

const undoBut = document.createElement('button')
undoBut.textContent = "Undo"
undoBut.id = 'undoBut'
undoBut.classList.add('homoBut')
helpPad.appendChild(undoBut)

function undoLast() {
    if (undoList.length > 0) {
        op = undoList[undoList.length-1][0]
        alg = undoList[undoList.length-1][1]
        doMath()
        undoList.pop()
        stepsText.pop()
        MathJax.typeset()
        clearHints()
        document.getElementById('steps').lastElementChild.remove()
    }
}

undoBut.addEventListener('click', undoLast)