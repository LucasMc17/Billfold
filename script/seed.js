"use strict";

const {
  db,
  models: { User, YearlyDeduction, MonthlyExpense, Category, DailyExpense },
} = require("../server/db");

async function createExpense(user, category, name, amount, year, month, day) {
  const thing = await DailyExpense.create({
    name,
    amount,
    date: new Date(year, month, day),
  });
  await thing.setUser(user);
  await thing.setCategory(category);
}

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log("db synced!");

  // Creating Users
  const Cody = await User.create({ username: "cody", password: "123" });
  await User.create({ username: "murphy", password: "123" });
  const expense = await YearlyDeduction.create({
    name: "stuff",
    rule: "FIXED",
    amount: 10000,
    startMonth: 1,
    startYear: 2021,
    startDate: new Date("1/1/2021"),
  });
  const newExpense = await YearlyDeduction.create({
    name: "stuff",
    rule: "PERCENT",
    percent: 0.25,
    startMonth: 1,
    startYear: 2021,
    startDate: new Date("1/1/2021"),
  });
  await expense.setUser(Cody);
  await newExpense.setUser(Cody);
  const rent = await MonthlyExpense.create({
    name: "rent",
    rule: "FIXED",
    amount: 900,
    startMonth: 1,
    startYear: 2021,
    startDate: new Date("1/1/2021"),
  });
  const fee = await MonthlyExpense.create({
    name: "dog fee",
    rule: "PERCENT",
    percent: 0.1,
    startMonth: 1,
    startYear: 2021,
    startDate: new Date("1/1/2021"),
  });
  await rent.setUser(Cody);
  await fee.setUser(Cody);
  const food = await Category.create({
    name: "food",
    rule: "PERCENT",
    percent: 0.25,
    startMonth: 1,
    startYear: 2021,
    startDate: new Date("1/1/2021"),
  });
  const fun = await Category.create({
    name: "fun",
    rule: "PERCENT",
    percent: 0.75,
    startMonth: 1,
    startYear: 2021,
    startDate: new Date("1/1/2021"),
  });
  await fun.setUser(Cody);
  await food.setUser(Cody);
  const laundry = await Category.create({
    name: "laundry",
    rule: "FIXED",
    amount: 65,
    startMonth: 1,
    startYear: 2021,
    startDate: new Date("1/1/2021"),
  });
  await laundry.setUser(Cody);
  const shirts = await DailyExpense.create({
    name: "washed shirts",
    date: new Date(),
    amount: 30.21,
  });
  await shirts.setUser(Cody);
  await shirts.setCategory(laundry);
  const pants = await DailyExpense.create({
    name: "washed pants",
    date: new Date(),
    amount: 20.56,
  });
  await pants.setUser(Cody);
  await pants.setCategory(laundry);
  const burger = await DailyExpense.create({
    name: "ate burger",
    date: new Date(2022, 1, 22),
    amount: 13,
  });
  await burger.setUser(Cody);
  await burger.setCategory(food);
  for (let i = 0; i < 100; i++) {
    await createExpense(
      Cody,
      [food, fun, laundry][Math.floor(Math.random() * 3)],
      i,
      Math.random() * 100,
      2021,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28),
    );
  }
  console.log(`seeded successfully`);
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await db.close();
    console.log("db connection closed");
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
