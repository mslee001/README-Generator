const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const codeBlock = "```";
let licenseBadge = "";

const writeFileAsync = util.promisify(fs.writeFile);

// array of questions for user
const questions = [
    "What is your GitHub username?",
    "What is your email address?",
    "Enter the title of your project",
    "What is the description of this project",
    "What command should be run to install dependencies?",
    "What does the user need to know about using the repo?",
    "What kind of license should your project have?",
    "What does the user need to know about contributing to the repo?",
    "What command should be run to run tests?"
];

//function to prompt the user for questions
function userPrompts() {
    return inquirer.prompt([
        {
            type: "input",
            message: questions[0],
            name: "username"
        },
        {
            type: "input",
            message: questions[1],
            name: "email"
        },
        {
            type: "input",
            message: questions[2],
            name: "title"
        },
        {
            type: "input",
            message: questions[3],
            name: "description"
        },
        {
            type: "input",
            message: questions[4],
            default: "npm i",
            name: "install"
        },
        {
            type: "input",
            message: questions[5],
            name: "usage"
        },
        {
            type: "list",
            message: questions[6],
            choices: ["MIT", "APACHE 2.0", "GPL 3.0", "BSD 3", "None"],
            name: "license"
        },
        {
            type: "input",
            message: questions[7],
            name: "contributor"
        },
        {
            type: "input",
            message: questions[8],
            default: "npm test",
            name: "test"
        },
  ])
}

//function to determine the license badge type based on the user input
function badgeType(response) {
    if (response.license == "MIT"){
        licenseBadge = "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)";
    } if (response.license == "APACHE 2.0") {
        licenseBadge = "[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)";
    } if (response.license == "GPL 3.0") {
        licenseBadge = "[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0)";
    } if (response.license == "BSD 3") {
        licenseBadge = "[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)";
    } else return;
    return licenseBadge;
}

// function to write README file
function generateReadMe(response) {
    return `
# ${response.title}
${licenseBadge}

## Description
${response.description}

## Table of contents
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#tests)
* [Questions](#questions)
        
## Installation
To install necessary dependencies, run the following command:
${codeBlock}
${response.install}
${codeBlock}

## Usage
${response.usage}

## License 
This project is licensed under the ${response.license} license.

## Contributing
${response.contributor}

## Tests
To run tests, run the following command:
${codeBlock}
${response.test}
${codeBlock}

## Questions
If you have any questions about this repository, open an issue or contact me directly at ${response.email}. You can find more of my work at [${response.username}](https://github.com/${response.username}).`;
}

// function to initialize program
async function init() {
    try {
        const response = await userPrompts();
        badgeType(response);
        const readme = generateReadMe(response);
        await writeFileAsync("output/README.md", readme);
        console.log("README.md file Created!");
    } catch(err) {
        console.log(err);
    }
}
  
// function call to initialize program
init();
