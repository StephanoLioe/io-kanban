export const initialData = {
  tasks: {
    1: { id: 1, title: 'Design', content: 'Make a awesome design' },
    2: { id: 2, title: 'Develop', content: 'Develop an awesome app' },
    3: {
      id: 3,
      title: 'Research',
      content: 'What kind of statemanagement will be used?',
    },
    4: {
      id: 4,
      title: 'Delegate',
      content: 'Let co-pilot build the whole app',
    },
    5: { id: 5, title: 'Verify', content: 'if all the cerificates are in' },
    6: { id: 6, title: 'Waiting on', content: 'approvals to go live' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To do',
      taskIds: [1, 2, 3, 4, 5, 6],
    },
    'column-2': {
      id: 'column-2',
      title: 'In progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Completed',
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ['column-1', 'column-2', 'column-3'],
}
