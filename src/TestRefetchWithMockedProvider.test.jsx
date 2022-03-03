import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    newData: jest.fn(() => ({
        data: {
            person: {
                id: 7,
                name: 'Amy Poehler',
            }
    }
    })),
};

const mockGetPersonQueryAfterSearch = {
    request: {
        query: GET_PERSON,
        variables: {
            name: 'John Smith',
        }
    },
    newData: jest.fn(() => ({
        data: {
            person: {
                id: 1,
                name: 'John Smith',
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
                    mockGetPersonQueryAfterSearch,
                ]}>
                <App />
            </MockedProvider>
        );
        await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
        expect(screen.getByRole('heading', { level: 1, name: 'Apollo Client Issue Reproduction'})).toBeInTheDocument();
        expect(mockGetPersonQuery.newData).toHaveBeenCalledTimes(1);
        const inputBoxes = screen.getAllByRole('textbox');
        expect(inputBoxes).toHaveLength(2);
        const searchNameInput = inputBoxes[1];
        userEvent.type(searchNameInput, 'John Smith');
        const button = screen.getByRole('button', { name: 'Search person'});
        expect(button).toBeInTheDocument();
        userEvent.click(button);
        await waitFor(()=> expect(mockGetPersonQuery.newData).toHaveBeenCalledTimes(1));
        await waitFor(()=> expect(mockGetPersonQueryAfterSearch.newData).toHaveBeenCalledTimes(1));
    });
});