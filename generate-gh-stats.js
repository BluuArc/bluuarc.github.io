"use strict";

const GithubGraphQLApi = require('node-github-graphql');
const fs = require('fs');
const ghql = new GithubGraphQLApi({
    token: fs.readFileSync('token.txt', 'utf8').replace(/\n/g, '').replace(/\r/g, ''),
});

function sendQuery (query, variables = null) {
  return new Promise((fulfill, reject) => {
    ghql.query(query, variables, (resp, err) => {
      if (err) {
        reject(err);
      } else {
        fulfill(resp);
      }
    });
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
const repoQuery = `
{
  user(login: "BluuArc") {
    name
    login
    repositories(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        shortDescriptionHTML
        pushedAt
        createdAt
        url
        nameWithOwner
        homepageUrl
        repositoryTopics(first: 50) {
          nodes {
            topic {
              name
            }
            url
          }
        }
        isPrivate
        deployments {
          totalCount
        }
        isEmpty
        packages {
          totalCount
        }
        languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
          edges {
            node {
              name
              color
            }
            size
          }
        }
      }
    }
    repositoriesContributedTo(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        description
        shortDescriptionHTML
        pushedAt
        createdAt
        url
        nameWithOwner
        homepageUrl
        repositoryTopics(first: 50) {
          nodes {
            topic {
              name
            }
            url
          }
        }
        isPrivate
        deployments {
          totalCount
        }
        isEmpty
        packages {
          totalCount
        }
        languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
          edges {
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
}`;

function createProjectEntry (projectData, customData = {}) {
  const project = {};
  project.name = customData.name || projectData.name;
  project.repoName = projectData.name;
  project.description = projectData.description;
  project.homepageURL = projectData.homepageUrl;
  project.lastPushedAt = projectData.pushedAt;
  project.createdAt = projectData.createdAt;
  project.repoURL = projectData.url;
  project.owner = projectData.nameWithOwner.split("/")[0];
  project.deployments = projectData.deployments.totalCount;
  project.packages = projectData.packages.totalCount;

  project.topics = [];
  if (projectData.repositoryTopics.nodes.length > 0) {
    project.topics = projectData.repositoryTopics.nodes
      .map(({ topic, url }) => ({ name: topic.name, url }));
  }

  project.languages = [];
  if (projectData.languages.edges.length > 0) {
    project.languages = projectData.languages.edges
      .map(({ node, size }) => ({ name: node.name, color: node.color, size }));
  }

  // TODO: implement tech used from custom-project-data.json
  // TODO: add support for a custom authorURL field (for non-github projects)
  project.techUsed = [];

  return project;
}

sendQuery(repoQuery).then((result) => {
  console.log("Creating project-data.json");
  const ghData = result.data;
  const customData = JSON.parse(fs.readFileSync("./custom-project-data.json", "utf8"));
  // data may include: images -> to go above/inside/below card?, technologies
  const extraProjectData = customData.additionalProjectInfo || {};
  const additionalProjects = customData.additionalProjects || {};

  const finalProjectData = {};
  const processProject = (project, propertyName) => {
    const { nameWithOwner: key } = project;
    const projectIncluded = !customData.ignoredProjects.includes(key);
    const projectNotAdded = !finalProjectData[key];

    if (projectIncluded && projectNotAdded && !project.isPrivate && !project.isEmpty) {
      console.log(`Adding ${key} in ${propertyName} list`);
      finalProjectData[key] = createProjectEntry(project, extraProjectData[key]);
    } else {
      console.log(`Skipping ${key} in ${propertyName} list`);
    }
    return projectIncluded;
  };

  ghData.user.repositoriesContributedTo.nodes = ghData.user.repositoriesContributedTo.nodes
    .filter((project) => processProject(project, "repositoriesContributedTo"));

  ghData.user.repositories.nodes = ghData.user.repositories.nodes
    .filter((project) => processProject(project, "repositories"));

  Object.entries(additionalProjects).forEach(([key, project]) => {
    if (!finalProjectData[key]) {
      console.log(`Adding ${key} in additional project list`);
      finalProjectData[key] = project;
    } else {
      console.log(`Skipping ${key} in additional project list`);
    }
  });

  fs.writeFileSync("public/project-data.json", JSON.stringify(finalProjectData, null, 2), "utf8");

  // console.log("Saving GH JSON object");
  // fs.writeFileSync("static/gh-projects.json", JSON.stringify(result, null, 2), "utf8");
}).then(() => {
  console.log("Done");
}).catch(console.error);
