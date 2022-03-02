import React, { useState} from 'react'
import {
    gql,
    useQuery,
    useMutation,
  } from "@apollo/client";
  import "./index.css";

  const ALL_PEOPLE = gql`
    query AllPeople {
      people {
        id
        name
      }
    }
  `;
  
  const GET_PERSON = gql`
    query GetPerson($name: String) {
      person(name: $name) {
        id
        name
      }
    }
  `;
  
  const ADD_PERSON = gql`
    mutation AddPerson($name: String) {
      addPerson(name: $name) {
        id
        name
      }
    }
  `;

export const App = () => {
    const [name, setName] = useState('');
    const [nameToSearch, setNameToSearch] = useState('');
    const {
      loading,
      data,
      error,
    } = useQuery(ALL_PEOPLE, {
        onError: error => {
            console.error(error);
          },
    });
    const {
      loading: loadingNameToSearch,
      data: resultFromSearch,
      refetch,
    } = useQuery(GET_PERSON,{
      variables: { name: '' },
      onError: error => {
        console.error(error);
      },
    });


    const [addPerson] = useMutation(ADD_PERSON, {
      update: (cache, { data: { addPerson: addPersonData } }) => {
        const peopleResult = cache.readQuery({ query: ALL_PEOPLE });
  
        cache.writeQuery({
          query: ALL_PEOPLE,
          data: {
            ...peopleResult,
            people: [
              ...peopleResult.people,
              addPersonData,
            ],
          },
        });
      },
      onError: error => {
        console.error(error);
      },
    });

    if(error) {
        return (
            <main>
                <h1>Whoops! Something went wrong.</h1>
            </main>
        )
    }
  
    return (
      <main>
        <h1>Apollo Client Issue Reproduction</h1>
        <p>
          This application can be used to demonstrate an error in Apollo Client.
        </p>
        <div className="add-person">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={evt => setName(evt.target.value)}
          />
          <button
            onClick={() => {
              addPerson({ variables: { name } });
              setName('');
            }}
          >
            Add person
          </button>
        </div>
        <div className="search-person">
          <label htmlFor="nameToSearch">Search name</label>
          <input
            type="text"
            name="nameToSearch"
            value={nameToSearch}
            onChange={evt => setNameToSearch(evt.target.value)}
          />
          <button
            onClick={async () => {
              await refetch({ name: nameToSearch });
              setNameToSearch('');
            }}
          >
            Search person
          </button>
        </div>
        <h2>Names</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {data?.people.map(person => (
              <li key={person.id}>{person.name}</li>
            ))}
          </ul>
        )}
        <h3>Get specific person</h3>
        {loadingNameToSearch ? (
          <p>Loading…</p>
        ) : (
          resultFromSearch?.person?.length > 0 && (<ul>
              <li key={resultFromSearch.person[0].id}>{resultFromSearch.person[0].name}</li>
          </ul>)
        )}
      </main>
    );
  }