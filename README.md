# Leetcode-cph-extension

A powerful **LeetCode Test Runner** integrated with **Visual Studio Code** to automate testing for competitive programming solutions. This tool simplifies the workflow of compiling, running, and validating solutions against predefined test cases, making coding practices more efficient and error-free.


---

## **Table of Contents**

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Project Structure](#project-structure)
5. [Technologies Used](#technologies-used)
6. [Future Enhancements](#future-enhancements)
7. [License](#license)
8. [Acknowledgments](#acknowledgments)

---

## **Features**

### 1. ** Problem Fetching**
- Automatically fetch problems from LeetCode using the problem slug
- Support for multiple programming languages (C++, Python, JavaScript, Java)
- Creates a structured project directory with:
   - Solution file with language-specific boilerplate code
   - Test cases directory with example test cases
   - Organized output directory for test results


### 2. **Test Case Management**
- Automatically extracts and saves example test cases from LeetCode problems
- Supports adding custom test cases through a simple interface
- Maintains separate directories for input and output test cases
- Automatically numbers and organizes test cases

### 3. **Test Execution**
- One-click test execution for all test cases
- Supports compilation and execution for multiple languages
- Real-time test results with detailed output
- Clear pass/fail indicators for each test case
- Comprehensive error reporting

### 4. **User Interface**
- Integrated sidebar with easy access to all commands
- Keyboard shortcuts for common operations
- Progress notifications during operations
- Detailed output channel for test results
- Clean and intuitive command interface

---

## **Installation**

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Your Workspace**:
   - Open the repository in **Visual Studio Code**.
   - Ensure that you have a workspace folder with the following structure:
     ```plaintext
     ├── solutions
     │   └── solution.cpp
     ├── testcases
     │   ├── problem1
     │   │   ├── input_1.txt
     │   │   ├── output_1.txt
     │   │   └── ...
     │   └── ...
     ```

4. **Run the Extension**:
   - Press `F5` in VS Code to start the extension in a new window.
   - Select a problem and run test cases via the command palette.

---

## **Usage**

1. **Prepare Your Solution**:
   - Place your solution file (e.g., `solution.cpp`) in the `solutions` directory.

2. **Add Test Cases**:
   - Organize input and output files in the `testcases` directory under the respective problem folder.
     ```plaintext
     test_cases/problem1/input_1.txt
     test_cases/problem1/output_1.txt
     ```

3. **Run Tests**:
   - Use the command palette in VS Code (`Ctrl+Shift+P`) and select:
     ```plaintext
     CPH: Run Test Cases
     ```
   - Choose a problem and test cases to execute.

4. **View Results**:
   - Check the results in the **Output Channel** with detailed logs for each test case.

---

## **Project Structure**

```plaintext
leetcode-helper/
├── src/
│   ├── extension.js          # Main extension file
│   ├── fetchQuestion.js      # Test case fetcher
│   ├── runTestCases.js       # Test executor
│   ├── languageConfig.js     # Language settings
│   ├── templates.js          # Code templates
│   ├── createSolutionFile.js # Solution file creator
│   ├── SidebarProvider.js    # Sidebar UI provider
│   └── testcases/            # Test case storage
├── solutions/                # Solution files
├── media/                    # Media files (CSS, images)
├── test/                     # Test files
├── .vscode/                  # VSCode settings
├── .gitignore                # Git ignore file
├── CHANGELOG.md              # Changelog
├── package.json              # NPM package configuration
├── README.md                 # Readme file
└── vsc-extension-quickstart.md # VSCode extension quickstart guide
```

---

## **Technologies Used**

- **Node.js**: Backend logic for running tests.
- **VS Code API**: Integration with Visual Studio Code.
- **Child Processes**: Handles compilation and execution commands.
- **File System (fs)**: Reads and writes test case files.

---

## **Future Enhancements**

1. Dynamic creation of test cases directly in VS Code.
2. Integration with online platforms like LeetCode and HackerRank.
3. Performance analytics (e.g., execution time and memory usage).
4. Graphical representation of test results.
5. Expanded language support and compiler configurations.

---

## **License**

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## **Acknowledgments**

- Thanks to the open-source community for inspiration and resources.
- Special thanks to contributors and testers who made this project possible.

---

Feel free to fork, improve, and use this tool to streamline your competitive programming practice!
