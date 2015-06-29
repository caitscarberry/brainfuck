var execInterval;
var waiting = false;

function initDataDisplay(){
	for(i = 0; i < 9; i++) {
		newCellHeader = document.createElement("th");
		newCellHeader.innerText = i;
		newCell = document.createElement("td");
		newCell.innerHTML = i + "<hr/>" + brainfuck.data[i];
		$("tr")[0].appendChild(newCell);
	}
}

function updateDataDisplay(){
	firstCellDisplayed = Math.max(0,brainfuck.dataPointer-4);
	head = $("thead")[0];
	dataCells = $("tr")[0];
	for(i = 0; i < 9; i++) {
		var displayedCell;
		if(firstCellDisplayed+i<30000) {
			displayedCell = firstCellDisplayed+i;
		}
		else{
			displayedCell = firstCellDisplayed+i - 30000;
		}
		dataCells.childNodes[i].innerHTML = (displayedCell).toString() + "<hr/>" + brainfuck.data[displayedCell].toString();
		$(dataCells.childNodes[i]).removeClass("active");
	}
	$(dataCells.childNodes[brainfuck.dataPointer-firstCellDisplayed]).addClass("active");

}

function highlightCurrentInstruction(instr){
	disp = $("#program")[0];
	disp.innerHTML = brainfuck.program.substring(0,instr);
	disp.innerHTML = disp.innerHTML + "<span class='active'>"+brainfuck.program.charAt(instr)
		+"</span>";
	disp.innerHTML = disp.innerHTML + brainfuck.program.substring(instr+1);
}

function sendInstr(instr) {
	brainfuck.execute(instr);
	updateDataDisplay();

}

function step() {
	if(waiting) {
		return{'val':null,'instr':null};
	}
	if(brainfuck.program != $("#program")[0].innerText) {
		brainfuck.setProgram($("#program")[0].innerText);
	}

	res = brainfuck.step();
	if(res.val!=null) {
		consoleLines = $("#console")[0].children;
		line = consoleLines[consoleLines.length-1];
		line.innerHTML = line.innerHTML+res.val;
	}

	updateDataDisplay();

	if(res.instr>=brainfuck.program.length){
		clearInterval(execInterval);
	}
	highlightCurrentInstruction(res.instr);
}

function getInput(){
	pause();
	waiting = true;
	newLine = document.createElement("p");
	$("#console")[0].appendChild(newLine);
	newLine.innerText=">>>";
	inputSpace = document.createElement("div");
	inputSpace.contentEditable = "true";
	inputSpace.addEventListener("keypress",function(evt){
		if(evt.which==13) {
			waiting = false;
			evt.preventDefault();
			inputLine = $("#console")[0].children[$("#console")[0].children.length-1];
			inputSpace = inputLine.children[0];
			if(inputSpace.innerText.length>0){
				brainfuck.data[brainfuck.dataPointer] = inputSpace.innerText.charCodeAt(0);
			}
			else {
				brainfuck.data[brainfuck.dataPointer] = 0;
			}
			inputSpace.contentEditable = false;
			resume();
			newLine = document.createElement("p");
			$("#console")[0].appendChild(newLine);
			newLine.innerText="";
		}
	});
	newLine.appendChild(inputSpace);
	
}

function resume() {
	clearInterval(execInterval);
	execInterval = window.setInterval(step,50);
}

function run() {
	brainfuck.setProgram($("#program")[0].innerText);
	clearInterval(execInterval);
	execInterval = window.setInterval(step,50);
}

function pause() {
	clearInterval(execInterval);
}

$("#run")[0].addEventListener("click",run);
$("#pause")[0].addEventListener("click",pause);
$("#resume")[0].addEventListener("click",resume);
$("#step")[0].addEventListener("click",step);