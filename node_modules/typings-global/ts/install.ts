import * as smartshell from 'smartshell'
const semver = require("semver");

const safeInstall = async () => {
    const nodeVersion = (await smartshell.execSilent("node -v")).stdout;

    //check for existing node typings
    const treeLocal = (await smartshell.execSilent("(npm list)")).stdout
    const treeOuter = (await smartshell.execSilent("(cd ../ && npm list)")).stdout;

    let typesNodeRegex = /\@types\/node/

    if (typesNodeRegex.test(treeLocal) || typesNodeRegex.test(treeOuter)) {
        console.log("@types/node already installed")!
    } else {
        console.log("@types/node not yet installed");
        var sanatizedNodeVersion = /\n?v(.*)\n?\s*$/.exec(nodeVersion)[ 1 ];
        console.log("Your node version is " + sanatizedNodeVersion);
        console.log("Trying to install node typings in matching version...");

        var nodeMajorVersion = semver.major(sanatizedNodeVersion);
        var nodeNextVersion = nodeMajorVersion + 1;
        let exitCode = (await smartshell.exec(`cd .. && npm install --no-save @types/node@">=${nodeMajorVersion}.0.0 <${nodeNextVersion}.0.0"`)).exitCode
        if (exitCode !== 0) {
            await smartshell.exec('npm install --no-save @types/node')
        }
    }
}
safeInstall()
