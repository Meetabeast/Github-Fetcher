import axios from "axios";
import inquirer from "inquirer";
import { execSync } from "child_process"

async function run() {
    try {
        const { username } = await inquirer.prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Enter your github username:',
            },
        ]);
    
        const response = await axios.get(`https://api.github.com/users/${username}/repos`);
        let repositories = response.data;
    
        const { repository } = await inquirer.prompt([
            {
                type: 'list',
                name: 'repository',
                message: 'Select a repository:',
                choices: repositories.map(repo => ({ name: repo.name, value: repo })),
            },
        ]);
    
        const repoInfo = await axios.get(repository.url);
    
        execSync(`git clone ${repoInfo.data.clone_url} ${repoInfo.data.name}`, (error, stdout, stderr) => {
            if (error) {
                console.error('Error cloning repository', error.message);
            } else {
                console.log('Repository cloned successfully!');
                console.log(`Clone output:\n${stdout}`);
            }
        });
    } catch (error) {
        console.log('A Error occured: ', error.message)
    }
}

run();