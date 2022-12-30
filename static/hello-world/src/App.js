import React, { useEffect, useState } from 'react';
import { TreeGridComponent, ColumnsDirective, ColumnDirective, DataStateChangeEventArgs, Selection, RowDD, Inject } from "@syncfusion/ej2-react-treegrid";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { getIssueData, updateIssueLink } from "./data/ManageData";
import { handleExpand } from "./service/TreeGridHandler";
import './App.css';

function App() {
  const [dataSource, setDataSource] = useState(null);
  let projects = "TEST";
  let issueLinkType = {
    id: "10008",
    name: "Track/Contributes",
    inward: "Contributes To",
    outward: "Tracks"
  }
  let treegridIssue;

  const handleClickSearch = async () => {
    if (treegridIssue) {
      treegridIssue.showSpinner(); // show the spinner
      let value = await getIssueData(projects, issueLinkType, "");
      treegridIssue.hideSpinner(); // hide the spinner  
      setDataSource(value);
    }
  };

  const handleDataStateChange = (dataState) => {
    console.log("dataState");
    console.log(dataState);
    if (dataState.requestType === 'expand') {
      handleExpand(projects, issueLinkType, treegridIssue, dataState).then((childData) => {
        dataState.childData = childData;
        dataState.childDataBind();
      });
    } else {
      console.log("else");
      getIssueData(projects, issueLinkType, "").then((data) => {
        treegridIssue && setDataSource(data);
      });
    }
  }

  const handleRowDrop = (rowDragEventArgs) => {
    if (rowDragEventArgs.dropPosition === "middleSegment") { // drop on row
      let currentViewRecords = treegridIssue.getCurrentViewRecords();
      let source = currentViewRecords[rowDragEventArgs.fromIndex];
      let target = currentViewRecords[rowDragEventArgs.dropIndex];
      console.log(rowDragEventArgs);
      console.log(source);
      console.log(target);
      updateIssueLink(target.key, source.parentId, source.key, issueLinkType);
    } else { // cancel drop on other position
      rowDragEventArgs.cancel = false;
    }
  }

  return (
    <div>
      <div>
        <ButtonComponent cssClass='e-info' onClick={handleClickSearch}>Search</ButtonComponent>
      </div>
      <div className="control-pane">
        <div className="control-section">
          <TreeGridComponent
            ref={g => treegridIssue = g}
            dataSource={dataSource}
            dataStateChange={handleDataStateChange}
            treeColumnIndex={0}
            enableCollapseAll="true"
            idMapping='id'
            parentIdMapping="parentId"
            hasChildMapping="isParent"
            allowRowDragAndDrop={true}
            childMapping="childIssues"
            rowDrop={handleRowDrop}
          >
            <ColumnsDirective>
              <ColumnDirective
                field="key"
                headerText="Issue Key"
              ></ColumnDirective>
              <ColumnDirective
                field="summary"
                headerText="Summary"
              ></ColumnDirective>
              <ColumnDirective
                field="issueType"
                headerText="Issue Type"
              ></ColumnDirective>
              <ColumnDirective
                field="assignee"
                headerText="Assignee"
              ></ColumnDirective>
              <ColumnDirective
                field="storyPoint"
                headerText="Story Point"
              ></ColumnDirective>
            </ColumnsDirective>
            <Inject services={[RowDD, Selection]} />
          </TreeGridComponent>
        </div>
      </div>
    </div>
  );
}

export default App;
