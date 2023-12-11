const { process_params } = require("express/lib/router");
const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://testuser:${password}@desarrollo.54pfgxm.mongodb.net/?retryWrites=true&w=majority`;

// Definir el esquema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// Definir el modelo
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 5) {
  addPerson();
} else {
  if (process.argv.length === 3) {
    getAllPeople();
  } else {
    console.log(`Porfavor provea los atributos correspondientes:
        Para consultar todas las personas --> node mongo.js <password>
        Para añadir una persona --> node mongo.js <password> <name> <number>`);
    process.exit(1);
  }
}

function addPerson() {
  mongoose.connect(url);

  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  newPerson
    .save()
    .then((result) => {
      console.log(
        `added ${newPerson.name} number ${newPerson.number} to phonebook`
      );
    })
    .catch((error) => console.error(error))
    .finally(() => mongoose.connection.close());
}

function getAllPeople() {
  mongoose.connect(url);

  Person.find({})
    .then((result) => {
      result.forEach((p) => console.log(p));
    })
    .catch((error) => console.error(error))
    .finally(() => mongoose.connection.close());
}
