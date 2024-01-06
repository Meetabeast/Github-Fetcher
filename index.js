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
        const repositories = response.data;

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
            if(error) {
                console.error('Error cloning repository', error.message);
            } else {
                console.log('Repository cloned successfully!');
                console.log(`Clone output:\n${stdout}`);
            }
        })
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

async function run2() {
    try {
        let { repositoryType } = await inquirer.prompt([
            {
                type: 'list',
                name: 'repositoryType',
                message: 'Select the type of repository.',
                choices: ['Public', 'Private'],
            },
        ]);

        repositoryType = repositoryType.toLowerCase();
        
        let repositories;

        switch(repositoryType) {
            case "public": {
                const { username } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'username',
                        message: 'Enter your github username:',
                    },
                ]);
        
                const response = await axios.get(`https://api.github.com/users/${username}/repos`);
                repositories = response.data;
            }
            break;
            case "private": {
                const credentials = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'username',
                        message: 'Enter your GitHub username:',
                    },
                    {
                        type: 'password',
                        name: 'token',
                        message: 'Enter your Personal Access Token:',
                    },
                ]);

                const responsePrivate = await axios.get('https://api.github.com/user/repos', {
                    auth: {
                        username: credentials.username,
                        password: credentials.token,
                    },
                });

                repositories = responsePrivate.data;
            }
            break;
            default: {
                console.error('Invalid repository type selected.');
                return;
            }
        }

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
        console.error('An error occurred:', error.message);
    }
}

run2();