const progressions = {
  UT: {
    IMNY: {
      'Non-Majors': {
        courses: [1, 2],
      },
      'Required Core': {
        courses: [103, 101, 102],
        notes: 'Freshman take 101 and 102, transfers can take 103 instead',
      },
      Electives: {
        courses: [201, 220, 221, 224, 240, 244, 251, 261, 271, 283, 285],
        notes:
          'Electives divided into five categories, 8 credits  needed in each category',
      },
    },
  },
};

const progressions2 = {
  UT: {
    IMNY: [
      {
        name: 'Non-Major Courses',
        courses: [1, 2],
      },
      {
        name: 'Required Core',
        courses: [101, 102, 103],
      },
    ],
  },
};

export default progressions;
