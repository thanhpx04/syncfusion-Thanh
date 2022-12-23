import { requestJira } from "@forge/bridge"

const data = async (projects, linkType, issueKey) => {
    // let listProject = projects.map(element => JSON.stringify(element.key))
    // const params = issueKey === "" ? `project in (${listProject}) AND (filter != ${linkType.id})` : `project in (${listProject}) AND (filter != ${linkType.id}) AND issue =${issueKey}`;
    const params = issueKey === "" ? `project = ${projects} AND (filter != "${linkType.id}")` : `project = ${projects} AND (filter != "${linkType.id}") AND issue =${issueKey}`;
    const response = await requestJira(`/rest/api/2/search?jql=${params}`);
    return await response.json();
};

const issueData = async (projects, linkType, issueKey) => {
    console.log("call API");
    const result = await data(projects, linkType, issueKey);
    if (result.errorMessages) {
        return {
            error: result.errorMessages
        };
    }
    let childIssues = [];
    await Promise.all(result.issues.map(async (element) => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary,
            assignee: element.fields.assignee ? element.fields.assignee.displayName : null,
            status: {
                text: element.fields.status.name
            },
            storyPoint: element.fields.customfield_10033,
            issueType: element.fields.issuetype.name
        }

        let children = await findChildByJql(projects, linkType, item);
        item.childIssues = children;
        childIssues.push(item)
    }))
    return childIssues.sort((a, b) => b.id - a.id);
}

export const findChildByJql = async (projects, linkType, issue) => {
    // let listProject = projects.map(element => JSON.stringify(element.key))
    // let jqlFindChildByID = `project in (${listProject}) and issue in linkedIssues("${issue.key}", ${linkType.outward})`
    let jqlFindChildByID = `project = ${projects} and issue in linkedIssues("${issue.key}", "${linkType.outward}")`
    let url = `/rest/api/2/search?jql=${jqlFindChildByID}`
    const response = await requestJira(url);
    const data = await response.json();
    let listChildren = []
    await data.issues.forEach(element => {
        let item = {
            id: element.id,
            key: element.key,
            summary: element.fields.summary,
            assignee: element.fields.assignee ? element.fields.assignee.displayName : null,
            status: {
                text: element.fields.status.name
            },
            storyPoint: element.fields.customfield_10033,
            issueType: element.fields.issuetype.name
        }
        listChildren.push(item);
    })
    return listChildren;
}

export const loadChild = async (source, parentKey, childIssues) => {
    source.forEach((element) => {
        if (element.key === parentKey) {
            element.childIssues = childIssues;
            return source;
        }
        if (element.childIssues !== undefined) {
            loadChild(element.childIssues, parentKey, childIssues);
        }
    });
};

const getIssueLinks = async (issueKey) => {
    const response = await requestJira(`/rest/api/3/issue/${issueKey}?fields=issuelinks`);
    const data = await response.json()
    return await data.fields.issuelinks
}
export default issueData;