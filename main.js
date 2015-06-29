var Brainfuck = function() {
	this.data = new Array(30000).join("0").split("").map(parseFloat);
	this.dataPointer = 0;
	this.instrPointer = 0;
	this.program = "";
	this.loopStartPointers = [];
}

Brainfuck.prototype.execute = function(instr) {
	switch (instr) {
		case ">":
			if(this.dataPointer<30000-1) {
				this.dataPointer++;
			}
			else {
				this.dataPointer = 0;
			}
			break;

		case "<":
			if(this.dataPointer>0) {
				this.dataPointer--;
			}
			else {
				this.dataPointer = 30000;
			}
			break;

		case "+":
			this.data[this.dataPointer]++;
			break;

		case "-":
				this.data[this.dataPointer]--;
			break;

		case ".":
			return {'instr':this.instrPointer, 'val':String.fromCharCode(this.data[this.dataPointer])};

		case ",":
			getInput();
			break;

		case "[":
			if(this.data[this.dataPointer]!=0) {
				this.loopStartPointers.push(this.instrPointer);
			}
			
			//find matching ] and jump to it
			else {
				openLoops = 1;
				ii = this.instrPointer+1;
				while(openLoops>0) {
					if(this.program[ii]=="[") {
						openLoops++;
					}
					else if(this.program[ii]=="]") {
						openLoops--;
					}
					ii++;
				}
				this.instrPointer = ii-1;
			}
			break;

		case "]":
			if(this.data[this.dataPointer]!=0) {
				this.instrPointer = this.loopStartPointers[this.loopStartPointers.length-1];
			}
			else {
				this.loopStartPointers.pop();
			}
			break;
	}

	return {'instr':this.instrPointer, 'val':null};
}

Brainfuck.prototype.step = function(){
	res = this.execute(this.program.charAt(this.instrPointer));
	this.instrPointer++;
	return res;
}

Brainfuck.prototype.setData = function(value){
	this.data[this.dataPointer] = value;
}

Brainfuck.prototype.setProgram = function(program){
	this.program = program;
	this.dataPointer = 0;
	this.instrPointer = 0;
	this.data = new Array(30000).join("0").split("").map(parseFloat);
}

brainfuck = new Brainfuck();