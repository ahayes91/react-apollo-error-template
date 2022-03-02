import React from 'react'
import { App } from './App';
import {
    ApolloProvider,
  } from "@apollo/client";
  import { client } from './client'

export const AppWithProvider = () => (
    <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);