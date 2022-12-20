import React, { useEffect, useState } from 'react';
import { TreeGridComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-treegrid";
import issueData, { findChildByJql } from "./data/fetchData";

// import { sampleData } from "./data/data.js";

function App() {
  const [dataSource, setDataSource] = useState([]);

  return (
    <div className="control-pane">
      <div className="control-section">
        <TreeGridComponent
          dataSource={dataSource}
          treeColumnIndex={1}
          childMapping="subtasks"
        >
          <ColumnsDirective>
            <ColumnDirective
              field="taskID"
              headerText="Task ID"
              width="70"
              textAlign="Right"
            ></ColumnDirective>
            <ColumnDirective
              field="taskName"
              headerText="Task Name"
              width="200"
            ></ColumnDirective>
          </ColumnsDirective>
        </TreeGridComponent>
      </div>
    </div>
  );
}

export default App;
