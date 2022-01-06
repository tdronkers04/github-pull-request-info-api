# GitHub Pull Request Info API

## Installation

- Navigate to a new folder in your terminal and execute the following command (SSH):

  `git clone git@github.com:tdronkers04/github-pull-request-info-api.git`

- Install the necessary dependencies with `npm install`

## How to Use

- Run `npm start` to start the server. You should see *listening on port 3000 of localhost...* in your logs

- navigate to `localhost:3000` in your browser

- Enter a the url of the github repo you'd like to learn more about.

- URL must be in the format of `https://github.com/userName/repositoryName`

## Data Provided by the API

For each *open* pull request in the requested repository, the following data will be returned:

- **Total Commits**
- **Last Commit Date**
- **Last Commit Author**
- **Last Comit Message**