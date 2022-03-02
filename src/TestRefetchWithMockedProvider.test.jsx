import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen, waitFor } from '@testing-library/react';
import { App } from './App';
import '@testing-library/jest-dom/extend-expect';
import { AppWithProvider } from './AppWithProvider';

describe('Apollo Mocked Provider when refetch is called with different variables', () => {
    it('should indicate when new queries are being called', async () => {
        render(
            <MockedProvider
                mocks={[

                ]}>
                <App />
            </MockedProvider>
        );
        await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());
        expect(screen.getByRole('heading', { level: 1, name: 'Apollo Client Issue Reproduction'})).toBeInTheDocument();
    });
});