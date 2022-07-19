import React, {useState, useEffect} from 'react';
import InfoBox from './InfoBox'
import Map from './Map'
import Table from './Table'
import LineGraph from './LineGraph'
import {sortData, prettyPrintStat} from "./util"
import './App.css';
import {FormControl,Select, MenuItem, Card, CardContent} from '@material-ui/core'
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 14.80746, lng: 20});
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) =>{
      setCountryInfo(data)
    })
  },[])

  useEffect(() =>{
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) =>{
        const countries = data.map((country) => (
          {
            name : country.country, //United Satates
            value : country.countryInfo.iso2 // US
          }
        ));
        const sortedData = sortData(data);
        console.log("Table Data",sortedData)
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    console.log('yoooo', countryCode);
    setCountry(countryCode);
    
    const url = 
      countryCode === 'worldwide'
      ? 'https://disease.sh/v3/covid-19/all'
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      if(countryCode === 'worldwide'){
        setMapCenter([14.80746,20]);
        setMapZoom(2)
      }else{
        setMapZoom(4);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      }
    })
  };

  console.log("Country Info", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country} >
              <MenuItem value="worldwide">Worldwide</MenuItem> 
              {countries.map((country) =>(
                <MenuItem value={country.value}>{country.name}</MenuItem> 
              ))}
            
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={countryInfo.cases}
          />
          <InfoBox 
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={countryInfo.recovered}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          />
        </div>
        
        <Map
          casesType = {casesType}
          countries = {mapCountries}
          center = {mapCenter}
          zoom = {mapZoom}  
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
