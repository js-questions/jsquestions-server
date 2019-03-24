const { mockUsers } = require('./users');
const { mockQuestions } = require('./questions');
const { mockOffers } = require('./offers');
const { updateQuestions } = require('./updateQuestions');
const { updateOffers } = require('./updateOffers');
const db = require('./../../database/models');

const mocks = {
  User: mockUsers,
  Question: mockQuestions,
  Offer: mockOffers,
}

for (let group in mocks) {
  mocks[group].forEach(async unit => {
    const newInstance = await db[group].create( unit );
    console.log('Created ', newInstance);
    return;
  })
}

// const updates = {
//   Question: updateQuestions,
//   Offer: updateOffers,
// }

// for (let group in updates) {
//   updates[group].forEach(async unit => {
//     await db[group].update( unit.update, unit.options )
//   })
// }
