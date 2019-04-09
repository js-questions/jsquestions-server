const { mockUsers } = require('./users');
const { mockQuestions } = require('./questions');
const { mockOffers } = require('./offers');
const db = require('./../../models');

const mocks = {
  User: mockUsers,
  Question: mockQuestions,
  Offer: mockOffers,
};

for (let group in mocks) {
  mocks[group].forEach(async unit => {
    await db[group].create( unit );
  })
};
