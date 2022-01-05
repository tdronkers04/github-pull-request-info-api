const fetch = require('node-fetch');

async function fetchPullRequestData(userName, repoName) {
  try {
    const url = `https://api.github.com/repos/${userName}/${repoName}/pulls?state=open`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch {
    throw new Error ('Unable to retrieve URL: ' + url);
  }
}

async function formatPullRequestData(userName, repoName) {
  let pullRequests = await fetchPullRequestData(userName, repoName);
  let formattedData = await pullRequests.map(pullRequest => {
    return {title: pullRequest.title, 
            commitsURL: pullRequest.commits_url,
            commitsData: null};
  });
  return formattedData;
}

async function fetchCommitsData(userName, repoName) {
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
        const response = await fetch(url);
        
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
  
  (async function() {
    try {
      let index = 0;
      for await (const response of data) {
        data[index]['commitsData'] = response.length;
        // console.log(data[index]);
        index += 1;
      }
    } catch (error) {
      console.error('Caught: ' + error.message);
    }
  })();

  return data;
};

// fetchCommitsData('colinhacks', 'zod');

(async function(userName, repoName) {
  let completedData = await fetchCommitsData(userName, repoName);
  console.log(completedData);
})('colinhacks', 'zod');

