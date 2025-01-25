const fs = require("fs").promises;
const path = require("path");
const { spawn } = require("child_process");
const vscode = require("vscode");
const { getLanguageFromExtension, languageConfig } = require("./languageConfig");

let outputChannel;

// Helper function to normalize output
function normalizeOutput(output) {
    if (!output) return '';
    // Remove whitespace, make lowercase, remove quotes
    return output.toString()
        .replace(/\s+/g, '')
        .toLowerCase()
        .replace(/^["']|["']$/g, '');
}

// Helper function to compare outputs
function compareOutputs(actual, expected) {
    const normalizedActual = normalizeOutput(actual);
    const normalizedExpected = normalizeOutput(expected);
    return normalizedActual === normalizedExpected;
}

// Format test result message
function formatTestResult(testCase, actual, expected, passed) {
    return {
        passed,
        message: `${passed ? '✅' : '❌'} Test Case ${testCase}:`,
        details: `Expected Output: ${expected}\nActual Output: ${actual || 'N/A'}`,
        status: passed ? 'passed' : 'failed'
    };
}

// Main test runner function
async function runTest(testCase, input, expectedOutput, command) {
    try {

        // Log command being executed
        console.log('Executing command:', command);
        console.log('Input:', input);

        const actualOutput = await executeCommand(command, input);
        const passed = compareOutputs(actualOutput, expectedOutput);
        
        return formatTestResult(
            testCase,
            actualOutput.trim(),
            expectedOutput.trim(),
            passed
        );
    } catch (error) {
        console.error('Test execution error:', error);
        return formatTestResult(
            testCase,
            'Runtime Error: ' + error.message,
            expectedOutput.trim(),
            false
        );
    }
}

async function runTestCases() {
    try {
        // Create output channel 
        if (!outputChannel) {
            outputChannel = vscode.window.createOutputChannel('LeetCode Tests');
        }
        outputChannel.show();
        outputChannel.clear();

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("Please open a workspace first");
        return;
    }

        // Find solution and test cases
        //const solutionsDir = vscode.workspace.workspaceFolders?.[0]?.uri?.fsPath || path.resolve(__dirname, '../solutions');

        const solutionsDir = path.join(workspaceFolder.uri.fsPath, 'solutions');
        await fs.mkdir(solutionsDir, { recursive: true });
        const testCasesDir = path.join(__dirname, 'test_cases');

        // Get problem directories
        const problemDirs = await fs.readdir(testCasesDir, { withFileTypes: true });
        const problems = problemDirs
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        if (problems.length === 0) {
            throw new Error("No problems found. Please fetch test cases first.");
        }

        // Let user select problem
        const selectedProblem = await vscode.window.showQuickPick(problems, {
            placeHolder: "Select problem to run tests for"
        });

        if (!selectedProblem) {
            throw new Error("No problem selected");
        }

        // Get test cases for selected problem
        const problemDir = path.join(testCasesDir, selectedProblem);
        const testFiles = await fs.readdir(problemDir);
        const testCases = testFiles
            .filter(f => f.startsWith('input_'))
            .map(f => f.replace('input_', '').replace('.txt', ''));


        if (testCases.length === 0) {
            throw new Error("No test cases found. Please fetch or add test cases first.");
        }

        // Let user select test cases
        const selectedTests = await vscode.window.showQuickPick(testCases, {
            canPickMany: true,
            placeHolder: "Select test cases to run (select multiple with space)"
        });

        if (!selectedTests || selectedTests.length === 0) {
            throw new Error("No test cases selected");
        }

        // Find solution file
        const files = await fs.readdir(solutionsDir);
        const solutionFile = files.find(f => f.startsWith('solution.'));
        if (!solutionFile) {
            throw new Error("No solution file found");
        }

        /*const compile = spawn('clang++', [
            '-std=c++11',
            solutionPath.replace(/"/g, ''), // Ensure the path is unquoted here
            '-o',
            outputPath.replace(/"/g, '')
        ], {
            cwd: solutionsDir,
            shell: true,
            env: { ...process.env }
        });*/
        

        // Get language config
        const extension = path.extname(solutionFile).slice(1);
        const language = getLanguageFromExtension(extension);

        if (!language) {
            throw new Error(`Unsupported file extension: ${extension}`);
        }

        // Run selected test cases
        //const solutionPath = path.join(solutionsDir, solutionFile);
        const solutionPath = `"${path.join(solutionsDir, 'solution.cpp').replace(/\\/g, '/')}"`;

        const command = languageConfig[language].runCommand(solutionPath);

        let passedTests = 0;
        const problemTestDir = path.join(testCasesDir, selectedProblem);
        
        const testInputFiles = (await fs.readdir(problemTestDir))
            .filter(f => f.startsWith('input_'))
            .sort();

        for (const inputFile of testInputFiles) {
            const testNum = inputFile.replace('input_', '').replace('.txt', '');
            const input = await fs.readFile(path.join(problemTestDir, inputFile), 'utf8');
            const expectedOutput = await fs.readFile(
                path.join(problemTestDir, `output_${testNum}.txt`), 
                'utf8'
            );

            try {
                const actualOutput = await executeCommand(command, input);
                const passed = compareOutputs(actualOutput, expectedOutput);
                
                if (passed) passedTests++;
                
                outputChannel.appendLine(`Test ${testNum}: ${passed ? '✅ PASSED' : '❌ FAILED'}`);
                if (!passed) {
                    outputChannel.appendLine(`Expected: ${expectedOutput}`);
                    outputChannel.appendLine(`Got: ${actualOutput}`);
                }
            } catch (error) {
                outputChannel.appendLine(`Test ${testNum}: ❌ FAILED (Runtime Error)`);
                outputChannel.appendLine(error.message);
            }
        }

        // Show results
        const totalTests = testInputFiles.length;
        if (passedTests === totalTests) {
            vscode.window.showInformationMessage(
                `✅ All tests passed! (${passedTests}/${totalTests})`
            );
        } else {
            vscode.window.showErrorMessage(
                `❌ Some tests failed. (${passedTests}/${totalTests})`
            );
        }

        for (const test of selectedTests) {
            outputChannel.appendLine(`\n📝 Running test case ${test}:`);

            const inputPath = path.join(testCasesDir, selectedProblem, `input_${test}.txt`);
            const outputPath = path.join(testCasesDir, selectedProblem, `output_${test}.txt`);

            const input = await fs.readFile(inputPath, 'utf8');
            const expectedOutput = await fs.readFile(outputPath, 'utf8');

            const result = await runTest(test, input, expectedOutput, command);
            
            outputChannel.appendLine(result.message);
            outputChannel.appendLine(result.details);
            outputChannel.appendLine('');
            
            if (result.passed) passedTests++;

            try {
                const actualOutput = await executeCommand(command, input);
                outputChannel.appendLine(`Input: ${input.trim()}`);
                outputChannel.appendLine(`Expected: ${expectedOutput.trim()}`);
                outputChannel.appendLine(`Got: ${actualOutput.trim()}`);
                
                if (actualOutput.trim() === expectedOutput.trim()) {
                    passedTests++;
                    outputChannel.appendLine('✅ Test Passed\n');
                } else {
                    outputChannel.appendLine('❌ Test Failed\n');
                }
            } catch (error) {
                outputChannel.appendLine(`❌ Runtime Error: ${error.message}\n`);
            }
        }

        const message = `${passedTests}/${selectedTests.length} tests passed`;
        if (passedTests === selectedTests.length) {
            vscode.window.showInformationMessage(`✅ All tests passed! ${message}`);
        } else {
            vscode.window.showErrorMessage(`❌ Some tests failed. ${message}`);
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to run tests: ${error.message}`);
    }
}

/*async function executeCommand(command, input) {
    try {
        // Get absolute path and handle spaces
        const solutionsDir = path.resolve(__dirname, '..', 'solutions').replace(/\\/g, '/');
        
        // For C++ specifically
        if (command.includes('g++')) {
            const solutionPath = `"${path.join(solutionsDir, 'solution.cpp').replace(/\\/g, '/')}"`;
            const outputPath = `"${path.join(solutionsDir, 'temp').replace(/\\/g, '/')}"`;
            
            console.log('Solutions directory:', solutionsDir);
            console.log('Source path:', solutionPath);
            console.log('Output path:', outputPath);

            return new Promise((resolve, reject) => {
                // Compile with proper path escaping
                const compile = spawn('g++', [
                    solutionPath.replace(/"/g, ''),
                    '-o',
                    outputPath.replace(/"/g, '')
                ], {
                    cwd: solutionsDir,
                    shell: true,
                    env: { ...process.env }
                });

                let compileError = '';
                compile.stderr.on('data', (data) => {
                    compileError += data.toString();
                    console.error('Compile error:', data.toString());
                });

                compile.on('close', (code) => {
                    if (code !== 0) {
                        reject(new Error(`Compilation failed: ${compileError}`));
                        return;
                    }

                    // Run the compiled program
                    const run = spawn(outputPath.replace(/"/g, ''), [], {
                        cwd: solutionsDir,
                        shell: true
                    });

                    let output = '';
                    let runError = '';

                    if (input) {
                        run.stdin.write(input);
                        run.stdin.end();
                    }

                    run.stdout.on('data', (data) => {
                        output += data.toString();
                    });

                    run.stderr.on('data', (data) => {
                        runError += data.toString();
                        console.error('Run error:', data.toString());
                    });

                    run.on('close', (code) => {
                        if (code === 0) {
                            resolve(output);
                        } else {
                            reject(new Error(`Runtime Error: ${runError}`));
                        }
                    });
                });
            });
        }
        // ...existing code...
    } catch (error) {
        console.error('Execute command error:', error);
        throw new Error(`Failed to execute command: ${error.message}`);
    }
}*/

async function executeCommand(command, input) {
    return new Promise((resolve, reject) => {
        const compile = spawn('bash', ['-c', command], { shell: true });

        let compileError = '';
        compile.stderr.on('data', (data) => {
            compileError += data.toString();
        });

        compile.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Compilation failed: ${compileError}`));
            }

            const run = spawn('./temp', [], { shell: true });
            let output = '';
            let runError = '';

            if (input) {
                run.stdin.write(input);
                run.stdin.end();
            }

            run.stdout.on('data', (data) => {
                output += data.toString();
            });

            run.stderr.on('data', (data) => {
                runError += data.toString();
            });

            run.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(new Error(`Runtime Error: ${runError}`));
                }
            });
        });
    });
}


module.exports = runTestCases;
