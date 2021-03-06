import React from "react";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Criar, Login } from "./pages/Login";
import { Poeta } from "./pages/Poeta";

export function Router(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>    
            <Route path="/poeta" element={<Poeta/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/login/criar" element={<Criar/>}/>
            <Route path="/poesias/:slug" element={<Home/>}/>
            <Route path="*" element={<h1>Sinto muito, esta página não existe</h1>}/>
        </Routes>
    )
}