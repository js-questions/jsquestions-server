const { updateQuestions } = require('./updateQuestions');
const { updateOffers } = require('./updateOffers');
const db = require('./../../models');

const updates = {
  Question: updateQuestions,
  Offer: updateOffers,
};

for (let group in updates) {
  updates[group].forEach(async unit => {
    await db[group].update( unit.update, unit.options )
  })
};