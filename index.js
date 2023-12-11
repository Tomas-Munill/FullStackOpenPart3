const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config(); 
const Person = require('./models/person');

app.use(express.json());
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '' )

//app.use(morgan("tiny"));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/*
let persons = [
      {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
    ];
*/

app.get("/api/persons", (request, response, next) => {
  return Person
    .find({})
    .then(people => response.json(people));
});

app.get("/api/info", (request, response, next) => {
    Person.find({}).then(people => {
      const numberOfPeople = people.length
      const currentDate = new Date();
      response.send(`
      <p>Phonebook has info for ${numberOfPeople} people</p>
      <p>${currentDate.toString()}</p>
      `);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => response.status(204).end())
      .catch(error => next(error))
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  /*
  if (!body.name) {
    return response.status(400).json({ 
        error: 'name missing' 
  })
  };

  if (!body.number) {
      return response.status(400).json({ 
          error: 'number missing' 
  })
  };
  */
  
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
});

app.post("/api/persons", (request, response, next) => {
    const body = request.body;

    /*
    La validación la dejo en manos de mongosse, definiendo el esquema de persona

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
    })
    };
    
    if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
    })
    };

    if (persons.find(p => p.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    */

    const person = new Person({
      name: body.name,
      number: body.number
    })

    person.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
})

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})