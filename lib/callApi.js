const fetch = require('node-fetch');

async function fetchPullRequestData(userName, repoName) {
  try {
    const url = `https://api.github.com/repos/${userName}/${repoName}/pulls?state=open`;
    const response = await fetch(url, {
      headers: {
        authorization: null
      }
    });
    const data = await response.json();
    return data;
  } catch {
    throw new Error ('Unable to retrieve URL: ' + url);
  }
}

async function formatPullRequestData(userName, repoName) {
  let pullRequests = await fetchPullRequestData(userName, repoName);
  
  if (pullRequests.length === 0) {
    throw new Error ('There are no open pull requests for this repository');
  }

  let formattedData = await pullRequests.map(pullRequest => {
    return {title: pullRequest.title, 
            commitsURL: pullRequest.commits_url,
            commitsData: null};
  });
  return formattedData;
}

async function fetchCompletePrData(userName, repoName) {
  let data = await formatPullRequestData(userName, repoName);
  
  data[Symbol.asyncIterator] = function() {
    let index = 0;
    return {
      async next() {
        if (index === data.length) {
          return {
            done: true
          };
        }
        const url = data[index++]['commitsURL'];
        const response = await fetch(url, {
          headers: {
            authorization: null
          }
        });
        
        if (!response.ok) {
          throw new Error ('Unable to retrieve URL: ' + url);
        }

        return {
          value: await response.json(),
          done: false
        };
      }
    };
  };
  
  return (async function() {
    try {
      let index = 0;
      for await (const response of data) {
        data[index]['commitsData'] = {
          numberCommits: response.length,
          lastCommitDate: response[response.length - 1]["commit"]["author"]["date"],
          lastCommitAuthor: response[response.length - 1]["commit"]["author"]["name"],
          lastCommitMsg: response[response.length - 1]["commit"]["message"]
        }
        index += 1;
      }
      return data;
    } catch (error) {
      console.error('Caught: ' + error.message);
    }
  })();
};

module.exports = {
  fetchPullRequestData,
  formatPullRequestData,
  fetchCompletePrData
};