const express = require('express');
const app = express();

app.use(express.json())

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

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/info", (request, response) => {
    const numberOfPeople = persons.length;
    const currentDate = new Date();
    response.send(`
    <p>Phonebook has info for ${numberOfPeople} people</p>
    <p>${currentDate.toString()}</p>
    `);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const found = persons.find(p => p.id === id);
    if (found) {
        response.json(found);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);
    response.status(204).end();
});

const generarId = () => Math.round(Math.random()*100000000)

app.post("/api/persons", (request, response) => {
    const body = request.body;

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

    const person = {
        name: body.name,
        number: body.number,
        id: generarId(),
    }

    persons.push(person);
    response.json(person);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})