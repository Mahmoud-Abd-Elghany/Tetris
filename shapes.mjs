export const width = 10;
const secondRow = width;
const thirdRow = width*2;
const fourthRow = width*3;
const lShape = [
    [1, secondRow+1, thirdRow+1, 2],
    [secondRow, secondRow+1, secondRow+2, thirdRow + 2],
    [1, secondRow+1, thirdRow, thirdRow +1],
    [secondRow, thirdRow, thirdRow+1, thirdRow+2]
]

const stairShape = [
    [1, 2, secondRow, secondRow+1],
    [0, secondRow, secondRow+1, thirdRow+1],
    [1, 2, secondRow, secondRow+1],
    [0, secondRow, secondRow+1, thirdRow+1],
]

const arrowShape = [
    [1, secondRow, secondRow+1, secondRow+2],
    [1, secondRow+1, secondRow+2, thirdRow+1],
    [secondRow, secondRow+1, secondRow+2, thirdRow+1],
    [1, secondRow, secondRow+1, thirdRow+1]
]

const lineShape = [
    [1, secondRow + 1, thirdRow + 1, fourthRow + 1],
    [0, 1, 2, 3]
]

const boxShape = [
    [0,1,secondRow, secondRow+1]
]

const shapes = [boxShape, lineShape, arrowShape, stairShape,lShape]

export default shapes