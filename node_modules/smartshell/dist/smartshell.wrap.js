"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugins = require("./smartshell.plugins");
/**
 * import path
 */
let importPath = (stringArg) => {
    if (process.env.SMARTSHELL_PATH) {
        let commandResult = `PATH=${process.env.SMARTSHELL_PATH} && ${stringArg}`;
        // console.log(commandResult)
        return commandResult;
    }
    else {
        return stringArg;
    }
};
/**
 * executes a given command async
 * @param commandStringArg
 */
exports.exec = (commandStringArg, silentArg = false, strictArg = false) => {
    let done = plugins.smartq.defer();
    plugins.shelljs.exec(importPath(commandStringArg), { async: true, silent: silentArg }, (code, stdout, stderr) => {
        if (stderr
            && (stderr !== '')
            && (!silentArg || strictArg)
            && (process.env.DEBUG === 'true')) {
            console.log('StdErr found.');
            console.log(stderr);
        }
        if (strictArg) {
            done.reject(new Error(stderr));
            return;
        }
        done.resolve({
            exitCode: code,
            stdout: stdout
        });
    });
    return done.promise;
};
/**
 * executes a given command async and silent
 * @param commandStringArg
 */
exports.execSilent = (commandStringArg) => __awaiter(this, void 0, void 0, function* () {
    return yield exports.exec(commandStringArg, true);
});
/**
 * executes strict, meaning it rejects the promise if something happens
 */
exports.execStrict = (commandStringArg) => __awaiter(this, void 0, void 0, function* () {
    return yield exports.exec(commandStringArg, true, true);
});
/**
 * executes a command and allws you to stream output
 */
exports.execStreaming = (commandStringArg, silentArg = false) => {
    let childProcessEnded = plugins.smartq.defer();
    let execChildProcess = plugins.shelljs.exec(importPath(commandStringArg), { async: true, silent: silentArg }, (code, stdout, stderr) => {
        childProcessEnded.resolve({
            exitCode: code,
            stdout: stdout
        });
    });
    return {
        childProcess: execChildProcess,
        finalPromise: childProcessEnded.promise
    };
};
exports.execStreamingSilent = (commandStringArg) => {
    return exports.execStreaming(commandStringArg, true);
};
/**
 * executes a command and returns promise that will be fullfilled once an putput line matches RegexArg
 * @param commandStringArg
 * @param regexArg
 */
exports.execAndWaitForLine = (commandStringArg, regexArg, silentArg = false) => {
    let done = plugins.smartq.defer();
    let execStreamingResult = exports.execStreaming(commandStringArg, silentArg);
    execStreamingResult.childProcess.stdout.on('data', (stdOutChunk) => {
        if (regexArg.test(stdOutChunk)) {
            done.resolve();
        }
    });
    return done.promise;
};
exports.execAndWaitForLineSilent = (commandStringArg, regexArg) => {
    exports.execAndWaitForLine(commandStringArg, regexArg, true);
};
/**
 * get a path
 */
exports.which = (cmd) => {
    let done = plugins.smartq.defer();
    plugins.which(cmd, (err, path) => {
        if (err) {
            done.reject(err);
        }
        done.resolve(path);
    });
    return done.promise;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hcnRzaGVsbC53cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vdHMvc21hcnRzaGVsbC53cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxnREFBK0M7QUFzQi9DOztHQUVHO0FBQ0gsSUFBSSxVQUFVLEdBQUcsQ0FBQyxTQUFTLEVBQVUsRUFBRTtJQUNyQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDaEMsSUFBSSxhQUFhLEdBQUcsUUFBUSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsT0FBTyxTQUFTLEVBQUUsQ0FBQTtRQUN6RSw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLGFBQWEsQ0FBQTtJQUN0QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsU0FBUyxDQUFBO0lBQ2xCLENBQUM7QUFDSCxDQUFDLENBQUE7QUFFRDs7O0dBR0c7QUFDUSxRQUFBLElBQUksR0FBRyxDQUFDLGdCQUF3QixFQUFFLFlBQXFCLEtBQUssRUFBRSxTQUFTLEdBQUcsS0FBSyxFQUF3QixFQUFFO0lBQ2xILElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFlLENBQUE7SUFDOUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDOUcsRUFBRSxDQUFDLENBQ0QsTUFBTTtlQUNILENBQUMsTUFBTSxLQUFLLEVBQUUsQ0FBQztlQUNmLENBQUMsQ0FBQyxTQUFTLElBQUksU0FBUyxDQUFDO2VBQ3pCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUNsQyxDQUFDLENBQUMs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