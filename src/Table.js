import React from 'react'
import numeral from "numeral"
import './Table.css';

function Table({countries}) {
    return (
        <div className="table">
            {countries.map(({country,cases,countryInfo}) => (
                <tr>    
                    <td><img width="40px" height="25px" src={countryInfo.flag}></img></td>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
        </div>
    )
}

export default Table
