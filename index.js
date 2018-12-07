require('dotenv').config();
const mysql = require('mysql');
const util = require('util');

const User = require('./user');
const Car = require('./car');

global.db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

global.db.query = util.promisify(global.db.query);


(async function() {

// //						all users
// console.log(await User.get());



// //					Открыть с БД и вывести в консоль сузествующего пользователя с машинами

// const user = await User.find(1);
// console.log(user);

// //					Создать нового пользователя

// const newUser = new User();
// newUser.first_name = 'Glek';
// newUser.last_name = 'asvgsbjbnjkfkjfkf';
// newUser.age = 521;
// newUser.gender = 'M';
// await newUser.save();


// //					Изменить имя пользователю

// const user20 = await User.find(20);
// user20.first_name = 'NEW_NAME';
// await user20.save();

// //					Удалить пользователя

// const user6 = await User.find(13);
// await user6.delete();

// //пример использования where
// console.log(await User.where([['age', '=', 222], ['first_name', '=', 'fn'], ['id', '>', '20']]));

// 				// Добавить пользователю новую машину

// const user2 = await User.find(2);
// console.log(user2.cars);
// const newCar = new Car();
// newCar.model = 'Pejo';
// newCar.year = 2009;
// await user.addCar(newCar);
// console.log(user.cars);
})()