// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  useEffect(() => {
  fetchUsers()
	  .then((res) => res.json())
	  .then((json) => setCharacters(json["users_list"]))
	  .catch((error) => { console.log(error); });
  }, [] );

  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function deleteUser(id) {
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE"
    });

    return promise;
  }

  function removeOneCharacter(id) {
    deleteUser(id)
    .then((res) => {
      if (res.status === 204) {
        const updated = characters.filter((character) => character._id != id);
        setCharacters(updated);
      }

      else if (res.status === 404) {
        console.log('User not found on server');
      }

      else {
        throw new Error('Delete failed');
      }
    })
    .catch((error) => {
      console.log(error);
    })   
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status === 201) { // check for 201
          return res.json(); // call response.json
        }
        else {
          throw new Error('Failed to add user');
        }
      })
      .then((newUser) => setCharacters([...characters, newUser]))
      .catch((error) => {
        console.log(error);
      })
  }

  return (
  <div className="container">
    <Table
      characterData={characters}
      removeCharacter={removeOneCharacter}
    />
    <Form handleSubmit={updateList} />
  </div>
  );
}

export default MyApp;