const LOG_CORE_OUTPUT = true;
class BaseCoreInterface {
    constructor(program_location) {
        this.program_location = program_location;
    }

    callFunction(functionName, functionArguments) {
        this.functionCalls[functionName](functionArguments)
    }

    startDolphin(args, onOuput) {
        this.process = execFile(this.program_location, args, {
            detached: false
        });

        process.stdout.on('data', onOutput);
    }

    quitDolphin() {
        this.process.kill('SIGKILL');
    }

};

module.exports = class SmashLadderCoreInterface extends BaseCoreInterface {
    constructor(program_location) {
        super(program_location);
        //Register callable functions
        this.functionCalls = {
            "startNetplay": this.beginNetplay,
            "quitDolphin": this.quitDolphin
        };
    }
        //arguments are passed as arrays
        beginNetplay(netplay_code){
            console.log("Starting netplay : " + netplay_code);
            this.startDolphin(["\n" + netplay_code[0]]);
        }
 
}