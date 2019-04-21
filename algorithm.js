const gridArray = [];
const gridWidth = 10;
const gridHeight = 10;
const openList = [];
const closedList = [[0,8]];
const actualPosition = [0,8];
const finalPosition = [6,0];
const gridTableEL = document.getElementById("gridTable");
var execution = null;

function generateGridStructure(){
    for(let row = 0; row < gridHeight; row++){
        gridArray[row] = new Array(gridHeight);
        for(let column = 0; column < gridWidth; column++){
            gridArray[row][column] = calculatePositionValue(row, column);
        }
    }
}

function calculatePositionValue(row, column){
    //let value = Math.abs( (row - finalPosition[0]) + ( column - finalPosition[1]) ); // Distancia Manhattan 
    let value = Math.max(Math.abs(row - finalPosition[0]), Math.abs(column - finalPosition[1])); // Distancia diagonal
    return value+1;
}

function validatePostiion(row, column){
    try{
        if(gridArray[row][column]){
            return true;
        }
    } catch (err) {
        return false;
    }
}

function getPossiblePaths(rowActual, columActual){
    let possiblePaths = [];
    if(validatePostiion(rowActual-1, columActual)) possiblePaths.push([rowActual-1, columActual]); // Norte
    if(validatePostiion(rowActual+1, columActual)) possiblePaths.push([rowActual+1, columActual]); // Sul
    if(validatePostiion(rowActual, columActual+1)) possiblePaths.push([rowActual, columActual+1]); // Leste
    if(validatePostiion(rowActual, columActual-1)) possiblePaths.push([rowActual, columActual-1]); // Oeste
    if(validatePostiion(rowActual-1, columActual+1)) possiblePaths.push([rowActual-1, columActual+1]); // Nordeste
    if(validatePostiion(rowActual-1, columActual-1)) possiblePaths.push([rowActual-1, columActual-1]); // Noroeste
    if(validatePostiion(rowActual+1, columActual+1)) possiblePaths.push([rowActual+1, columActual+1]); // Sudeste
    if(validatePostiion(rowActual+1, columActual-1)) possiblePaths.push([rowActual+1, columActual-1]); // Sudoeste
    return possiblePaths;
}

function checkPositionInOpenList(path){
    let res = null;
    for(let openPath of openList){
        if((openPath[0] === path[0]) && (openPath[1] === path[1])){
            console.log(`A posicao ${path} ja esta na openList`);
            res = true;
            break;
        } else {
            res = false;
        }
    }
    return res;
}

function checkPositionInClosedList(path){
    let res = null;
    for(let closedPath of closedList){
        if((closedPath[0] === path[0]) && (closedPath[1] === path[1])){
            console.log(`A posicao ${path} ja esta na closedList`);
            res = true;
            break;
        } else {
            res = false;
        }
    }
    return res;
}

function pushPossiblePathInOpenList(possiblePaths){
    possiblePaths.forEach(path => {
        let positionCheckOpenList = checkPositionInOpenList(path);
        let positionCheckClosedList = checkPositionInClosedList(path);
        if(!positionCheckOpenList && !positionCheckClosedList){
            openList.push(path);
            console.log(`Path ${path} adicionado a lista`);
        }
    });
}

function getPositionValueFromOpenList(){
    let openListValues = [];
    for(let position of openList){
        openListValues.push(gridArray[position[0]][position[1]]);
    }
    return openListValues;
}
function executeAlgorithm(){
    for(visited of closedList){
        if((visited[0] === finalPosition[0]) && (visited[1] === finalPosition[1])){
            console.log("--------FINAL------------");
            clearInterval(execution);
            return;
        } 
    }
    let possiblePaths = getPossiblePaths(actualPosition[0], actualPosition[1]);
    console.log("Possible paths:");
    console.log(possiblePaths);
    pushPossiblePathInOpenList(possiblePaths);
    console.log("Open List:");
    console.log(openList);
    let openListValues = getPositionValueFromOpenList();
    console.log("OpenList Values:");
    console.log(openListValues);
    let lowerValueIndex = openListValues.indexOf(Math.min(...openListValues));
    actualPosition[0] = openList[lowerValueIndex][0];
    actualPosition[1] = openList[lowerValueIndex][1];
    closedList.push(openList[lowerValueIndex]);
    openList.splice(lowerValueIndex, 1);
    console.log("Close List:");
    console.log(closedList);
    render();
}
function render(){
    let html = "<table>";
    for(let row = 0; row < gridWidth; row++){
        html += "<tr>";
        for(let column = 0; column < gridHeight; column++){
            color = "";
            for(let position of closedList){
                if((row === position[0]) && (column === position[1])){
                    color = "blue";
                }
            }
            if((row === actualPosition[0]) && (column === actualPosition[1])){
                color = "orange";
            }
            if((row === finalPosition[0]) && (column === finalPosition[1])){
                color = "green";
            }
            html += `<td style="background-color: ${color}">`;
            let positionValue = gridArray[row][column];
            html += `<div>${positionValue}</div>`;
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    gridTableEL.innerHTML = html;
}

function start(){
    generateGridStructure();
    render();
    execution = setInterval(executeAlgorithm, 1000);
}

this.start();