import React, { useState } from 'react';
import { fetchWeather } from './api/fetchWeather';
import './App.css';


const App = () => {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [timediff, setTimediff] = useState({});

    
    const search = async (e) => {
        let local = JSON.parse(localStorage.getItem("localData"));

        if(local == null) local = [];
        if(e.key === 'Enter') {
            let locdata = local.find(item => (item.city).toLowerCase() === query.toLowerCase())
            if(locdata) {
                setQuery('');
                let mins = Math.floor(((new Date().getTime()/1000)-(locdata.time))/60);
                console.log(locdata, timediff, local,'bye')
                if(mins < 10) {
                    setTimediff({
                            mins : mins,
                            date: locdata.datetime
                        })
                    return setWeather(locdata.data);}
            }
            const data = await fetchWeather(query)
            setWeather(data);
            setQuery('');
            setTimediff({
                mins : 0,
                date : new Date().toLocaleString()
            });
            const localstore = {
                data : data,
                city : data.name,
                datetime : new Date().toLocaleString(),
                time : new Date().getTime()/1000
            }
            localStorage.setItem("localData", JSON.stringify([localstore , ...local]))
            local = JSON.parse(localStorage.getItem("localData"));
            console.log(locdata, query, local , 'hi')
        }

    }
    
    return (
        <div className="main-container" >
                <input  type="text" className="search"  placeholder="City Name..." value={query} onChange={(e) => setQuery(e.target.value)} onKeyPress={search} />
            {weather.main && (
                <div className="city">
                   <h2 className="city-name">
                        <span>{weather.name}</span>
                        <sup>{weather.sys.country}</sup>
                    </h2>
                    <div className="city-temp">
                        {Math.round(weather.main.temp)}
                        <sup>&deg;C</sup>
                    </div>
                    <div className="info">
                        <img className="city-icon" src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
                        <p>{weather.weather[0].description}</p>
                        <p>searched at {timediff.date}</p>
                        <p id ='time'>{timediff.mins} min ago</p>
                    </div>
                </div>
            )}
        </div>
    ); 
}

export default App;