// 0 1 2
// 3 4 5
// 6 7 8
moveMap = {
    'UR': [1, 2, 4, 5],
    'DR': [4, 5, 7, 8],
    'DL': [3, 4, 6, 7],
    'UL': [0, 1, 3, 4],
    'U': [0, 1, 2, 3, 4, 5],
    'R': [1, 2, 4, 5, 7, 8],
    'D': [3, 4, 5, 6, 7, 8],
    'L': [0, 1, 3, 4, 6, 7],
    'ALL': [0, 1, 2, 3, 4, 5, 6, 7, 8]
}
cornerMap = {
    0: 2,
    2: 0,
    6: 8,
    8: 6
}
z_positions = [6, 3, 0, 7, 4, 1, 8, 5, 2]
z_prime_positions = [2, 5, 8, 1, 4, 7, 0, 3, 6]
function handleScramble(scramble){
    state = {
        front: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        back: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
    for (move of scramble.split(' ')){
        state = handleMove(state, move)
    }
    for(i=0;i<9;i++){
        state.front[i] = convertToClockPos(state.front[i])
        state.back[i] = convertToClockPos(state.back[i])
    }
    return state
    
}
function convertToClockPos(number){
    while (number < -5){
        number += 12
    }
    while (number > 6){
        number -= 12
    }
    return number
}
function handleMove(state, move){
    if(move === 'y2'){
        temp = state.back
        state.back = state.front
        state.front = temp
        return state
    }
    move_length = move.length - 2
    move_type = move.substring(0, move_length)
    if(!Object.keys(moveMap).includes(move_type)){
        return state
    }
    move_amount = parseInt(move.substring(move_length, move_length+1))
    move_direction = move.substring(move_length+1, move_length+2)
    if(move_direction == '-'){
        move_amount *= -1
    }
    for (move_pos of moveMap[move_type]){
        state.front[move_pos] += move_amount
        if(move_pos in cornerMap){
            state.back[cornerMap[move_pos]] -= move_amount
        }
    }
    return state
}
function rotate(state, rotation){
    if(rotation == 'y2'){
        return handleMove(state, 'y2')
    }
    if(rotation == 'z2'){
        state.front.reverse()
        state.back.reverse()
        return state
    }
    if(rotation == 'x2'){
        state = handleMove(state, 'y2')
        return rotate(state, 'z2')
    }
    if(rotation == 'z'){
        new_front = []
        for(pos of z_positions){
            new_front.push(state.front[pos])
        }
        new_back = []
        for(pos of z_prime_positions){
            new_back.push(state.back[pos])
        }
        state.front = new_front
        state.back = new_back
        return state
    }
    if(rotation == "z'"){
        new_front = []
        for(pos of z_prime_positions){
            new_front.push(state.front[pos])
        }
        new_back = []
        for(pos of z_positions){
            new_back.push(state.back[pos])
        }
        state.front = new_front
        state.back = new_back
        return state
    }
    return state
}
// 0 1 2
// 3 4 5
// 6 7 8
dial_positions = { //lowercase = back
    'dr': 0,
    'd': 1,
    'dl': 2,
    'r': 3,
    'c': 4,
    'l': 5,
    'ur': 6,
    'u': 7,
    'ul': 8,
    'UL': 0,
    'U': 1,
    'UR': 2,
    'L': 3,
    'C': 4,
    'R': 5,
    'DL': 6,
    'D': 7,
    'DR': 8
}
function getDial(state, pos){
    if(pos === pos.toLowerCase()){
        return state.back[dial_positions[pos]]
    }
    return state.front[dial_positions[pos]]
}
/*
1st letter: c-d
2nd letter: (dr-r) + (U-L)
3rd letter: d-r
4th letter: L-U
5th letter: Add the 3rd letter to UL and do L-UL
6th letter: U-C
7th letter: UR-U+C-D+l-ul+r
8th letter: (u-c+d) + (UL-L) + (DR-R)
9th letter: D-C
10th letter: (R-DR) + (l-u)
11th letter: R-D
12th letter: u-l
13th letter: Add the 11th letter to l and do ul-l
14th letter: c-u
*/
function calc_7simul(state){
    m1 =  convertToClockPos(getDial(state, 'c') - getDial(state, 'd'))
    m2 =  convertToClockPos(getDial(state, 'dr') - getDial(state, 'r') + getDial(state, 'U') - getDial(state, 'L'))
    m3 =  convertToClockPos(getDial(state, 'd') - getDial(state, 'r'))
    m4 =  convertToClockPos(getDial(state, 'L') - getDial(state, 'U'))
    m5 =  convertToClockPos(-m3 + getDial(state, 'L') - getDial(state, 'UL'))
    m6 =  convertToClockPos(getDial(state, 'U') - getDial(state, 'C'))
    m7 =  convertToClockPos(getDial(state, 'UR') - getDial(state, 'U') + getDial(state, 'C') - getDial(state, 'D') + getDial(state, 'l') - getDial(state, 'ul') + getDial(state, 'r'))
    m8 =  convertToClockPos(getDial(state, 'u') - getDial(state, 'c') + getDial(state, 'd') + getDial(state, 'UL') - getDial(state, 'L') + getDial(state, 'DR') - getDial(state, 'R'))
    m9 =  convertToClockPos(getDial(state, 'D') - getDial(state, 'C'))
    m10 = convertToClockPos(getDial(state, 'R') - getDial(state, 'DR') + getDial(state, 'l') - getDial(state, 'u'))
    m11 = convertToClockPos(getDial(state, 'R') - getDial(state, 'D'))
    m12 = convertToClockPos(getDial(state, 'u') - getDial(state, 'l'))
    m13 = convertToClockPos(getDial(state, 'ul') - getDial(state, 'l') - m11)
    m14 = convertToClockPos(getDial(state, 'c') - getDial(state, 'u'))

    return [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14]

}

function getHumanSolution(moves){
    sm = []
    for(move of moves){
        new_move = Math.abs(move) + (move > -1 ? '+' : '-')
        sm.push(new_move)
    }
    return `dl(${sm[0]},${sm[1]}) R(${sm[2]},${sm[3]}) DR(${sm[4]},${sm[5]}) \\(${sm[6]},${sm[7]}) UL(${sm[8]},${sm[9]}) L(${sm[10]},${sm[11]}) ur(${sm[12]},${sm[13]})`
}

function getAllSolutions(scramble){
    firstRotations = ["", "y2"]
    secondRotations = ["", "z", "z2", "z'"]
    solutions = []
    max_zeroes = 0
    min_ticks = 14 * 12
    for(firstRot of firstRotations){
        for(secondRot of secondRotations){
            state = handleScramble(scramble)
            state = rotate(state, firstRot)
            state = rotate(state, secondRot)
            memo = calc_7simul(state)
            sol = getHumanSolution(memo)
            solWithRotations = [firstRot, secondRot, sol].join(' ').trim()
            zeroes = memo.filter(x => x===0).length
            sumTicks = memo.reduce((partialSum, a) => partialSum + Math.abs(a), 0)
            max_zeroes = Math.max(max_zeroes, zeroes)
            min_ticks = Math.min(min_ticks, sumTicks)
            solutions.push({
                memo: memo,
                solution: solWithRotations,
                zeroes: zeroes,
                sumTicks: sumTicks,
            })

        }
    }
    solutions.sort((a, b) => ((14-a.zeroes)*1000+a.sumTicks) - ((14-b.zeroes)*1000+b.sumTicks))
    return {
        solutions: solutions,
        max_zeroes: max_zeroes,
        min_ticks: min_ticks,
        scramble: scramble
    }
}
function printSolutions(solutionsObj){
    finalHtml = ''
    imporant_moves_tommy = [0, 1, 2, 3, 6, 7]
    for(solution of solutionsObj.solutions){
        finalHtml += '<div class="solution">'
        finalHtml += `<p class="solution">${solution.solution}</p>`
        memoStr = solution.memo.map((move, index) => imporant_moves_tommy.includes(index) ? `<b>${move}</b>` : `${move}`).join(' ')
        finalHtml += `<p class="memo">memo: ${memoStr}</p>`
        finalHtml += `<p class="info">Ticks: ${solution.sumTicks}`
        finalHtml +=`, Zeroes: ${solution.zeroes}`
        clockDbLink = `https://cubedb.net/?puzzle=Clock&scramble=${encodeURIComponent(solutionsObj.scramble)}&alg=${encodeURIComponent(solution.solution)}`
        finalHtml += ` <a href="${clockDbLink}">cubedb</a>`
        finalHtml += '</p>'
        finalHtml += '</div>'
    }
    return finalHtml

}
result = document.getElementById('results')
document.getElementById('scr').addEventListener("input", (change) => {
    scr = change.target.value
    if(scr.length > 0){
        solObj = getAllSolutions(scr)
        if(solObj.min_ticks == 0) return;
        html = printSolutions(solObj)
        result.innerHTML = html
    }
})