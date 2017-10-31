"use strict";

/* global require */

let rp = require('request-promise');
let GithubGraphQLApi = require('node-github-graphql');
let fs = require('fs');
let ghql = new GithubGraphQLApi({
    token: fs.readFileSync('token.txt', 'utf8')
});

function sendQuery(query, variables = null){
    return new Promise((fulfill,reject) => {
        ghql.query(query, variables, (resp,err) => {
            if(err){
                reject(err);
            }else{
                fulfill(resp);
            }
        })
    });
}

let rateLimitQuery = `
query { 
  rateLimit{
    remaining
    limit
    cost
    resetAt
  }
}
`;

let repoQuery = `
query { 
  user(login:"BluuArc"){
    name
    login
    contributedRepositories(first:100, orderBy:{field:UPDATED_AT,direction:DESC}) {
      totalCount
      nodes{
        name
        
        description
        shortDescriptionHTML
        pushedAt
        createdAt
        url
        nameWithOwner
        repositoryTopics (first: 50) {
          nodes {
            topic{ name }
            url
          }
        }
        languages(first:50, orderBy:{field:SIZE, direction:DESC}) {
          edges{
            node {
              name
              color
            }
            size
          }
        }
      }
    }
    repositories(first:100, orderBy:{field:UPDATED_AT,direction:DESC}) {
      totalCount
      nodes{
        name
        description
        shortDescriptionHTML
        pushedAt
        createdAt
        url
        nameWithOwner
        repositoryTopics (first: 50) {
          nodes {
            topic{ name }
            url
          }
        }
        languages(first:50, orderBy:{field:SIZE, direction:DESC}) {
          edges{
            node {
              name
              color
            }
            size
          }
        }
      }
    }
  }
}
`

sendQuery(repoQuery).then((result) => {
    fs.writeFileSync('gh-projects.json',JSON.stringify(result,null,2),'utf8');
    console.log("Done");
}).catch(console.error);
