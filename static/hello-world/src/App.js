import React, { useEffect, useState } from 'react';
import { TreeGridComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-treegrid";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import issueData, { findChildByJql } from "./data/fetchData";
import './App.css';

function App() {
  const [dataSource, setDataSource] = useState([]);
  let treegridIssue;

  const handleClickSearch = async () => {
    treegridIssue && treegridIssue.showSpinner(); // show the spinner  
    let issueLinkType = {
      id: "10008",
      name: "Track/Contributes",
      inward: "Contributes To",
      outward: "Tracks"
    }
    let value = await issueData("TEST", issueLinkType, "");
    console.log("get value");
    treegridIssue && treegridIssue.hideSpinner(); // hide the spinner  
    setDataSource(value);
  };
  
  const onExpandingChange = (event) => {
    console.log("expanding");
  }
  
  const onExpandedChange = (event) => {
    console.log("expanded");
  };

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
            treeColumnIndex={0}
            enableCollapseAll="true"
            childMapping="issues"
            expanding={onExpandingChange}
            expanded={onExpandedChange}
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
          </TreeGridComponent>
        </div>
      </div>
    </div>
  );
}

export default App;
