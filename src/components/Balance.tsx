import React from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styled from "styled-components";

function Balance() {
    return (
        <Section>
            <div className="sales">
                <div className="sales__details">
                    <div>
                        <h4>Balance</h4>
                    </div>
                    <div>
                        <h5>PAST 30 DAYS</h5>
                    </div>
                </div>
                <div className="sales__graph">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Dépenser" stackId="a" fill="#14121F" />
                            <Bar dataKey="Restant" stackId="a" fill="#E5E5F1" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Section>
    )
}

export default Balance;
const data = [
    {
      name: 'Janvier',
      Restant: 1000,
      Dépenser: 300,
      amt: 700,
    },
    {
      name: 'Février',
      Restant: 1000,
      Dépenser: 300,
      amt: 700,
    },
    {
      name: 'Mars',
      Restant: 1000,
      Dépenser: 300,
      amt: 700,
    },
    {
      name: 'Avril',
      Restant: 1000,
      Dépenser: 300,
      amt: 700,
    },
    {
      name: 'Mai',
      Restant: 1000,
      Dépenser: 300,
      amt: 700,
    },
    {
      name: 'Juin',
      Restant: 1000,
      Dépenser: 300,
      amt: 700,
    },
    {
      name: 'Juillet',
      Restant: 1000,
      Dépenser: 300,
      amt: 700,
    },
{
    name: 'Aout',
    Restant: 1000,
      Dépenser: 300,
      amt: 700,
  },
  {
    name: 'Septembre',
    Restant: 1000,
      Dépenser: 300,
      amt: 700,
  },
  {
    name: 'Octobre',
    Restant: 1000,
      Dépenser: 300,
      amt: 700,
  },
  {
    name: 'Novembre',
    Restant: 1000,
      Dépenser: 300,
      amt: 700,
  },
  {
    name: 'Decembre',
    Restant: 1000,
      Dépenser: 300,
      amt: 700,
  },



  ];
const Section = styled.section`
.sales{
    color: black;
    width: 100%;
    .sales__details {
        display: flex;
        justify-content: space-between;
        margin: 1rem 0;
        div{
            display: flex;
            gap: 1rem;
            h5{
                color: gray;
            }
        }
    }
    .sales__graph{
        height: 10rem;
        width: 100%;
        .recharts-default-tooltip {
            background-color: black !important;
            border-color: black !important;
            color: white !important;
        }
    }
}

`;