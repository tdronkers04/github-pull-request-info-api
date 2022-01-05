const fetch = require('node-fetch');

async function getCommits(url) {
  const response = await fetch(url);
  const commitsData = await response.json();
  return commitsData.length;
}

async function getPulls(userName, repoName) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/pulls?state=open`;
  const response = await fetch(url);
  const data = await response.json();

  let outputData = {};

  data.forEach((item, index) => {
    // let commits = getCommits(item.commits_url);
    outputData[index] = {
      title: item.title,
      commits: null,
    }
  });
  return outputData;
}

(async function (userName, repoName) {
  let result = getPulls(userName, repoName);
  return await result;
})('colinhacks', 'zod').then(result => console.log(result));

