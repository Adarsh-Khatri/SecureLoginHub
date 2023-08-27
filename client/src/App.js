import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';


/* Importing All Components */
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recovery from './components/Recovery';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';


/* Auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth'

/* root routes */
const router = createBrowserRouter([
    {
        path: '/',
        element: <Username></Username>
    },
    {
        path: '/register',
        element: <Register></Register>
    },
    {
        path: '/password',
        element: <ProtectRoute><Password /></ProtectRoute>
    },
    {
        path: '/profile',
        element: <AuthorizeUser><Profile /></AuthorizeUser>
    },
    {
        path: '/recovery',
        element: <Recovery></Recovery>
    },
    {
        path: '/reset',
        element: <Reset></Reset>
    },
    {
        path: '*',
        element: <PageNotFound></PageNotFound>
    },
])


const theme = {
    app: {
        bg: "rgba(255, 255, 255, 0.55)"
    },
    username: {
        bg: "#aaa"
    },
    breakpoints: {
        laptop: '1080px',
    }
}


export default function App() {
    return (
        <main>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router}></RouterProvider>
            </ThemeProvider>
        </main>
    )
}
