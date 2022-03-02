import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { App, ALL_PEOPLE, GET_PERSON, ADD_PERSON } from './App';
import '@testing-library/jest-dom/extend-expect';
import { peopleData } from './client';

const mockAllPeopleQuery = {
    request: {
        query: ALL_PEOPLE,
    },
    result: jest.fn(() => ({
        data: {
            people: peopleData
        }
    })),
};
const mockGetPersonQuery = {
    request: {
        query: GET_PERSON,
        variables: {
            name: '',
        }
    },
    result: jest.fn(() => ({
        data: {
            person: {
                id: 7,
                name: 'Amy Poehler',
            }
    }
    })),
};

describe('Apollo Mocked Provider when refetch is called with different variables', () => {
    it('should indicate when new queries are being called', async () => {
        render(
            <MockedProvider
                mocks={[
                    mockAllPeopleQuery,
                    mockGetPersonQuery,
                ]}>
                <App />
            </MockedProvider>
        );
        await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
        expect(screen.getByRole('heading', { level: 1, name: 'Apollo Client Issue Reproduction'})).toBeInTheDocument();
    });
});