const functions = require("../lib/callApi");

describe('fetchPullRequestData', () => {
  test('return array with 8 total pull request objects for zod repo', () => {
    return functions.fetchPullRequestData('colinhacks', 'zod').then(data => {
      expect(data.length).toBe(8);
    });
  });    
});

describe('formatPullRequestData', () => {
  test('throw error if requested repo has no pull requests', () => {
    return functions.formatPullRequestData('tdronkers04', 'trading-cards').catch(error => {
      expect(error => expect(error).toMatch('error'));
    });
  });
  test('elemnts of returned array are objects containing exactly three properties', () => {
    return functions.formatPullRequestData('colinhacks', 'zod').then(data => {
      expect(Object.keys(data[0]).length === 3);
    });
  });
});

describe('fetchCompletePrData', () => {
  test('elements of returned array are objects containing exactly 4 properties', () => {
    return functions.fetchCompletePrData('colinhacks', 'zod').then(data => {
      expect(Object.keys(data[0]).length === 4);
    })
  })
});

