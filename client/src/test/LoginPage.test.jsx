import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider } from '../../context/ThemeContext';
import authReducer from '../../redux/slice/authSlice';
import LoginPage from '../LoginPage';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { vi } from 'vitest';

// Mock axios
vi.mock('axios');

const renderWithProviders = (ui) => {
    const store = configureStore({ reducer: { auth: authReducer } });
    return render(
        <Provider store={store}>
            <ThemeProvider>
                <BrowserRouter>
                    {ui}
                    <ToastContainer />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    );
};

describe('LoginPage', () => {
    it('should display an error toast on failed login', async () => {
        // Mock a failed API response
        axios.post.mockRejectedValue({
            response: { data: { message: 'Invalid credentials' } },
        });

        renderWithProviders(<LoginPage />);

        // Simulate user input
        await userEvent.type(screen.getByLabelText(/email address/i), 'wrong@example.com');
        await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        // Assert that the error toast appears
        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    });
});