exports.updateQuestions = [
  {
    update: {
      learner: 3,
    },
    options: {
      where: { question_id: 1 }
    }
  },
  {
    update: {
      answered_by: 2,
    
      learner: 4,
      answered: true,
    },
    options: {
      where: { question_id: 2 }
    }
  },
  {
    update: {
      learner: 6,
    },
    options: {
      where: { question_id: 3 }
    }
  },
  {
    update: {
      learner: 6,
    },
    options: {
      where: { question_id: 4 }
    }
  },
  {
    update: {
      learner: 6,
    },
    options: {
      where: { question_id: 5 }
    }
  },
  {
    update: {
      learner: 6,
    },
    options: {
      where: { question_id: 6 }
    }
  },
  {
    update: {
      answered_by: 3,
      learner: 6,
    },
    options: {
      where: { question_id: 7 }
    }
  },
  {
    update: {
      learner: 4,
    },
    options: {
      where: { question_id: 8 }
    }
  }
];
