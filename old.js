var turn = "x";
var bigBoard = document.getElementById("bigBoard");
var blurb = document.getElementById("blurb");
function getSquare(a, b, c, d){
  return bigBoard.children[0].children[a].cells[b].children[0].children[0].children[c].cells[d].children[0]
}
function getCoords(square){
	return [Array.prototype.indexOf.call(square.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.children, square.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement), square.parentElement.parentElement.parentElement.parentElement.parentElement.cellIndex, Array.prototype.indexOf.call(square.parentElement.parentElement.parentElement.children, square.parentElement.parentElement), square.parentElement.cellIndex]
}
function checkAdj(coords){
	if(!coords[0].every((element,index)=>element==coords[1][index]) && Math.abs(coords[0][0]-coords[1][0])<2 && Math.abs(coords[0][1]-coords[1][1])<2){
		return true;
	}else{
		return false;
	}
}
function getAdjSquares(square){
	var coords = getCoords(square);
	var adjs = []
	for(let i=0; i<3; i++){
		for(let j=0; j<3; j++){
			if(checkAdj([[coords[2], coords[3]], [i, j]])){
				adjs.push(getSquare(coords[0], coords[1], i, j))
			}
		}
	}
	return adjs;
}
function checkThreeSquare(square){
	if(!square.hasAttribute("p")){
		return false;
	}
	var cs = getCoords(square)
	if(cs[2]==1&&cs[3]==1){
		if(getSquare(cs[0], cs[1], 0, 0).getAttribute("p")==square.getAttribute("p") && getSquare(cs[0], cs[1], 2, 2).getAttribute("p")==square.getAttribute("p")){
			return [square, getSquare(cs[0],cs[1],0,0), getSquare(cs[0], cs[1], 2, 2)];
		}else if(getSquare(cs[0], cs[1], 0, 2).getAttribute("p")==square.getAttribute("p") && getSquare(cs[0], cs[1], 2, 0).getAttribute("p")==square.getAttribute("p")){
			return [square, getSquare(cs[0], cs[1], 0, 2), getSquare(cs[0], cs[1], 2, 0)];
		}
	};
	for(let i of getAdjSquares(square).filter(e=>e.getAttribute("p")==square.getAttribute("p"))){
		// console.log("i: ",i)
		for(let j of getAdjSquares(i).filter(e=>e.getAttribute("p")==i.getAttribute("p"))){
			// console.log("j: ",j)
			if(j!=i && j!=square/* && !checkAdj([[getCoords(j)[2], getCoords(j)[3]], [getCoords(square)[2], getCoords(square)[3]]])*/){
				cs = [cs[2],cs[3]];
				var ci = [getCoords(i)[2], getCoords(i)[3]];
				var cj = [getCoords(j)[2], getCoords(j)[3]];
				if((cs[0]==ci[0] && ci[0]==cj[0])||(cs[1]==ci[1]&&ci[1]==cj[1])||((cs[0]==cs[1])&&(ci[0]==ci[1])&&(cj[0]==cj[1]))||((2-cs[0]==cs[1])&&(2-ci[0]==ci[1])&&(2-cj[0]==cj[1]))){
					return [square, i, j];
				}
			}
		}
	}
	return false;
}
function takeTurn(square){
	if(square.hasAttribute("p") || !square.parentElement.parentElement.parentElement.parentElement.classList.contains("allowed") || square.parentElement.parentElement.parentElement.parentElement.hasAttribute("done")){
		return;
	}
	square.innerHTML = turn.toUpperCase();
	square.setAttribute("p", turn);
	for(i of square.parentElement.parentElement.parentElement.children){
		for(j of i.cells){
			if(checkThreeSquare(j.children[0])){
				[...checkThreeSquare(j.children[0])].forEach(e=>e.setAttribute("done", e.getAttribute("p")));
				j.parentElement.parentElement.parentElement.setAttribute("done", j.children[0].getAttribute("p"));
				j.parentElement.parentElement.parentElement.classList.remove("allowed");
			}
		}
	}
	var coords = getCoords(square);
	[...document.getElementsByClassName("allowed")].forEach(e=>e.classList.remove("allowed"))
	if(getSquare(coords[2],coords[3], 0, 0).parentElement.parentElement.parentElement.parentElement.getAttribute("done")){
		for(let i of document.querySelectorAll(".miniBoard:not([done])")){
			i.classList.add("allowed")
		}
	}else{
		getSquare(coords[2],coords[3],0,0).parentElement.parentElement.parentElement.parentElement.classList.add("allowed");
	}
	turn = turn=="x"?"o":"x";
	blurb.innerHTML=turn.toUpperCase()+"'s turn";
	blurb.setAttribute("p",turn);
}