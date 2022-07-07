export const mockData = {
  columns: [
    {
      id: 1,
      title: 'To do',
      position: 0,
      tasks: [
        {
          id: 1,
          title: 'Design',
          content: 'Make a awesome design',
          position: 1,
        },
        {
          id: 2,
          title: 'Develop',
          content: 'Develop an awesome app',
          position: 2,
        },
        {
          id: 3,
          title: 'Research',
          content: 'What kind of statemanagement will be used?',
          position: 3,
        },
        {
          id: 4,
          title: 'Delegate',
          content: 'Let co-pilot build the whole app',
          position: 4,
        },
        {
          id: 5,
          title: 'Verify',
          content: 'if all the cerificates are in',
          position: 5,
        },
      ],
    },
    {
      id: 2,
      title: 'In progress',
      position: 1,
      tasks: [
        {
          id: 6,
          title: 'Waiting on',
          content: 'approvals to go live',
          position: 0,
        },
      ],
    },
    {
      id: 3,
      title: 'Completed',
      position: 2,
      tasks: [],
    },
  ],
}
