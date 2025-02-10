import { useState, useEffect } from 'react';
import personService from './services/persons';

const Notification = ({ message, type }) => {
  if (!message) return null;

  const notificationStyle = {
    color: type === 'success' ? 'green' : 'red',
    background: type === 'success' ? '#d4edda' : '#f8d7da',
    fontSize: 16,
    border: `2px solid ${type === 'success' ? 'green' : 'red'}`,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  };

  return <div style={notificationStyle}>{message}</div>;
};

const Filter = ({ searchTerm, handleSearchChange }) => (
  <div>
    search: <input value={searchTerm} onChange={handleSearchChange} />
  </div>
);

const PersonForm = ({ newName, newNumber, handleNameChange, handleNumberChange, handleAddPerson }) => (
  <form onSubmit={handleAddPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Person = ({ person, handleDelete }) => (
  <li>
    {person.name} {person.number} 
    <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
  </li>
);

const Persons = ({ filteredPersons, handleDelete }) => (
  <ul>
    {filteredPersons.map(person => (
      <Person key={person.id} person={person} handleDelete={handleDelete} />
    ))}
  </ul>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ message: null, type: '' });

  useEffect(() => {
    personService.getAll()
      .then(initialPersons => setPersons(initialPersons))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: '' }), 3000);
  };

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearchTerm(event.target.value);

  const handleAddPerson = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        personService.update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNewName('');
            setNewNumber('');
            showNotification(`Updated ${newName}'s number`);
          })
          .catch(error => {
            console.error("Error updating person:", error);
            showNotification(`Failed to update ${newName}.`, 'error');
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };
    personService.create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);
        setNewName('');
        setNewNumber('');
        showNotification(`Added ${newName}`);
      })
      .catch(error => {
        console.error("Error adding person:", error);
        showNotification(`Failed to add ${newName}.`, 'error');
      });
  };

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
          showNotification(`Deleted ${name}`);
        })
        .catch(error => {
          console.error("Error deleting person:", error);
          showNotification(`Failed to delete ${name}.`, 'error');
        });
    }
  };

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type} />
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm 
        newName={newName} 
        newNumber={newNumber} 
        handleNameChange={handleNameChange} 
        handleNumberChange={handleNumberChange} 
        handleAddPerson={handleAddPerson} 
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDeletePerson} />
    </div>
  );
};

export default App;
