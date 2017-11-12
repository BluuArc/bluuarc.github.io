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
        homepageUrl
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
`;

function createProjectEntry(projectData, customData = {}) {
  let project = {};
  project.name = customData.name || projectData.name;
  project.repoName = projectData.name;
  project.description = projectData.description;
  project.homepageURL = projectData.homepageUrl;
  project.lastPushedAt = projectData.pushedAt;
  project.createdAt = projectData.createdAt;
  project.repoURL = projectData.url;
  project.owner = projectData.nameWithOwner.split("/")[0];

  project.topics = [];
  if (projectData.repositoryTopics.nodes.length > 0) {
    for (let t of projectData.repositoryTopics.nodes) {
      let topic = {
        name: t.topic.name,
        url: t.url
      };
      project.topics.push(topic);
    }
  }

  project.languages = [];
  if (projectData.languages.edges.length > 0) {
    for (let lang of projectData.languages.edges) {
      let languageEntry = {
        name: lang.node.name,
        color: lang.node.color,
        size: lang.size
      };
      project.languages.push(languageEntry);
    }
  }

  // TODO: implement tech used from custom-project-data.json
  // TODO: add support for a custom authorURL field (for non-github projects)
  project.techUsed = [];

  return project;
}

sendQuery(repoQuery).then((result) => {
  console.log("Saving GH JSON object");
  fs.writeFileSync('gh-projects.json',JSON.stringify(result,null,2),'utf8');
  return result.data;
}).then((ghData) => {
  console.log("Creating project-data.json");
  let customData = JSON.parse(fs.readFileSync("custom-project-data.json",'utf8'));
  let extraProjectData = customData.additionalProjectInfo || {};
  let additionalProjects = customData.additionalProjects || {};

  let finalProjectData = {};

  let ghProjects = ghData.user.contributedRepositories.nodes;
  for(let p of ghProjects){
    if(!finalProjectData[p.nameWithOwner] && customData.ignoredProjects.indexOf(p.nameWithOwner) === -1){
      console.log("Adding", p.nameWithOwner, "in contributedRepositories list");
      finalProjectData[p.nameWithOwner] = createProjectEntry(p,extraProjectData[p.nameWithOwner]);
    }else{
      console.log("Skipping",p.nameWithOwner,"in contributedRepositories list");
    }
  }

  ghProjects = ghData.user.repositories.nodes;
  for (let p of ghProjects) {
    if (!finalProjectData[p.nameWithOwner] && customData.ignoredProjects.indexOf(p.nameWithOwner) === -1) {
      console.log("Adding", p.nameWithOwner, "in repositories list");
      finalProjectData[p.nameWithOwner] = createProjectEntry(p, extraProjectData[p.nameWithOwner]);
    } else {
      console.log("Skipping", p.nameWithOwner, "in repositories list");
    }
  }

  for(let p in additionalProjects){
    if(!finalProjectData[p]){
      console.log("Adding", p.nameWithOwner, "in additional project list");
      finalProjectData[p] = p;
    }else{
      console.log("Skipping", p.nameWithOwner, "in additional project list");
    }
  }

  fs.writeFileSync('project-data.json',JSON.stringify(finalProjectData,null,2),'utf8');

  return;

}).then(() => {
  console.log("Done");
}).catch(console.error);
