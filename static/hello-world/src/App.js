import React, { useEffect, useState } from 'react';
import { TreeGridComponent, ColumnsDirective, ColumnDirective, DataStateChangeEventArgs, Selection, RowDD, Inject } from "@syncfusion/ej2-react-treegrid";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { issueData, findChildByJql } from "./data/fetchData";
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
    if(treegridIssue) {
      treegridIssue.showSpinner(); // show the spinner
      let value = await issueData(projects, issueLinkType, "");
      treegridIssue.hideSpinner(); // hide the spinner  
      setDataSource(value);
    }
  };

  const handleExpand = async (dataState) => {
    treegridIssue && treegridIssue.showSpinner(); // show the spinner
    const data = await findChildByJql(projects, issueLinkType, dataState.data);
    treegridIssue && treegridIssue.hideSpinner(); // hide the spinner  
    return data;
  }

  const handleDataStateChange = (dataState) => {
    console.log(dataState);
    if (dataState.requestType === 'expand') {
      handleExpand(dataState).then((childData) => {
        dataState.childData = childData;
        dataState.childDataBind();
      });
    } else {
      console.log("else");
      issueData(projects, issueLinkType, "").then((data) => {
        treegridIssue && setDataSource(data);
      });
    }
  }

  const handleRowDrop = (rowDragEventArgs) => {
    // console.log(rowDragEventArgs);
    // let currentViewRecords = treegridIssue.getCurrentViewRecords();
    // let target = currentViewRecords[rowDragEventArgs.dropIndex];
    // console.log(currentViewRecords);
    // console.log(target);
      console.log("handleRowDrop");
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
            idMapping='key'
            parentIdMapping="ParentItem"
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
