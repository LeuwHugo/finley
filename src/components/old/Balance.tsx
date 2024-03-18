import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const Balance = () => {
    const data = [
        { month: 'Janvier', Disponible: 4000, Dépenser: 2400 },
        { month: 'Février', Disponible: 3000, Dépenser: 1398 },
        { month: 'Mars', Disponible: 2000, Dépenser: 9800 },
        { month: 'Avril', Disponible: 2780, Dépenser: 3908 },
        { month: 'Mai', Disponible: 1890, Dépenser: 4800 },
        { month: 'Juin', Disponible: 2390, Dépenser: 3800 },
        { month: 'Juillet', Disponible: 3490, Dépenser: 4300 },
        { month: 'Aout', Disponible: 4000, Dépenser: 2400 },
        { month: 'Septembre', Disponible: 3000, Dépenser: 1398 },
        { month: 'Octobre', Disponible: 2000, Dépenser: 9800 },
        { month: 'Novembre', Disponible: 2780, Dépenser: 3908 },
        { month: 'Décembre', Disponible: 1890, Dépenser: 4800 },
    ];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Disponible" fill="#8884d8" />
                <Bar dataKey="Dépenser" fill="#82ca9d">
                    {
                        data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.Dépenser > entry.Disponible ? '#ff9999 ' : '#82ca9d'} />
                        ))
                    }
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Balance;
