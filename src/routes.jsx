import React from 'react'

import {Routes, Route } from 'react-router-dom'
import {Home} from './pages/Home'
import { Poeta } from './pages/Poeta';
import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';

export function MainRoutes(){
    return(
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/poeta' element={
                    <PrivateRoute>
                        <Poeta/>
                    </PrivateRoute>
                }
            />               
            <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
    )
};