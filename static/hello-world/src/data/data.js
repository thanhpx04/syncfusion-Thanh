exports.sampleData = [
    {
      taskID: 1,
      taskName: "Feature A",
      subtasks: [
        {
          taskID: 2,
          taskName: "Story A1"
        },
        {
          taskID: 3,
          taskName: "Story A2"
        }
      ]
    },
    {
      taskID: 4,
      taskName: "Feature B",
      subtasks: [
        {
          taskID: 5,
          taskName: "Story B1",
          subtasks: [
            {
              taskID: 6,
              taskName: "Task B11",
              subtasks: [
                {
                  taskID: 7,
                  taskName: "Sub-Task B111"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  