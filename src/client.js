import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  graphql,
  print,
} from 'graphql';

import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  Observable
} from "@apollo/client";

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  },
});

export const peopleData = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sara Smith' },
  { id: 3, name: 'Budd Deey' },
];

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    people: {
      type: new GraphQLList(PersonType),
      resolve: () => peopleData,
    },
    person: {
      type: new GraphQLList(PersonType),
      args: {
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = peopleData.filter(person => {
          return person.name === name
        })
        return person;
      }
    },
  },
});

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: { type: GraphQLString },
      },
      resolve: function (_, { name }) {
        const person = {
          id: peopleData[peopleData.length - 1].id + 1,
          name,
        };

        peopleData.push(person);
        return person;
      }
    },
  },
});

const schema = new GraphQLSchema({ query: QueryType, mutation: MutationType });

function delay(wait) {
  return new Promise(resolve => setTimeout(resolve, wait));
}

const link = new ApolloLink(operation => {
  return new Observable(async observer => {
    const { query, operationName, variables } = operation;
    await delay(300);
    try {
      const result = await graphql({
        schema,
        source: print(query),
        variableValues: variables,
        operationName,
      });
      observer.next(result);
      observer.complete();
    } catch (err) {
      observer.error(err);
    }
  });
});


export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});