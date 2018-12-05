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

// //					Открыть с БД и вывести в консоль сузествующего пользователя с машинами

// console.log(await User.get());
// console.log(await Car.get());

// //					Создать нового пользователя

// const newUser = new User();
// newUser.first_name = 'fn';
// newUser.last_name = 'ln';
// newUser.age = 222;
// newUser.gender = 'F';
// await newUser.save();

// const newCar = new Car();
// newCar.user_id = 1;
// newCar.model = 'Deo Nexia';
// newCar.year = 1998;
// await newCar.save();



// //					Изменить имя пользователю
// const user = new User();
// await user.load(13);
// user.first_name = 'NEW FIRST NAME';
// user.last_name = 'NEW LAST NAME';
// await user.save();


// const car = new Car();
// await car.load(4);
// car.year = 2015;
// await car.save();
////					Удалить пользователя

// const user6 = new User();

//пример использования where
//console.log(await User.where([['age', '=', 222], ['first_name', '=', 'fn'], ['id', '>', '20']]));

//				// Добавить пользователю новую машину

// const user = new User();
// await user.load(2);
// car = new Car();
// car.model = 'Audi';
// car.year = '2015';
// await user.addCar(car);
// console.log(await user.cars);
})()