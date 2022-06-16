import {Navigate, Route, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../auth';

export const PrivateRoute = ({children}) =>{
            var auth = isAuthenticated()
            return auth?children:<Navigate to="/login"/>
}