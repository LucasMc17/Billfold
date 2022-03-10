'use strict';

const {
  db,
  models: { User, YearlyDeduction },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  // Creating Users
  const Cody = await User.create({ username: 'cody', password: '123' });
  await User.create({ username: 'murphy', password: '123' });
  const expense = await YearlyDeduction.create({
    name: 'stuff',
    rule: 'FIXED',
    amount: 10000,
  });
  const newExpense = await YearlyDeduction.create({
    name: 'stuff',
    rule: 'PERCENT',
    percent: 0.25,
  });
  console.log(await Cody.incomeAfterDeduction);
  await expense.setUser(Cody);
  await newExpense.setUser(Cody);
  console.log(await Cody.incomeAfterDeduction);
  console.log(`seeded successfully`);
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
