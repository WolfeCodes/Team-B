import React, { useEffect, useState } from 'react';
import EditLog from './EditLog';
import DisplayDailyMeals from './DisplayDailyMeals';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
//useState updates as it renders
export default function DailyLog() {

    const [dailyLog, setDailyLog] = useState ({});
    const [loading, setLoading] = useState(false); //conditional rendering
    const [date, setDate] = useState(null);
    const [todaysRecipes, setTodaysRecipes] = useState([]);
    const [refresh, setRefresh] = useState(0);
    const [rendered, setRendered] = useState(false);
    const [removeMeals, setRemoveMeals] = useState(false);

//should fetch data from DailyLogController

    // useEffect(() => {
    //     setLoading(true);

    //     fetch('http://localhost:8080/api/dailylog')
    //       .then(response => response.json())
    //       .then(data => {setDailyLog(data);
    //                      setLoading(false);
    //                      console.log(dailyLog);
    //       })
    //       .catch(error => console.error('Error fetching data:', error));

    //       let todaysDate = dailyLog.date.date;
    //       setDate(todaysDate);
    //   }, []);
      
      async function fetchData() {
        let response = await fetch("http://localhost:8080/api/dailylog"); //await returns promise to allow to receive data "after the fact". fetch url for controller you receiving data from
        let data = await response.json() //convert response to json
        .then( data => {
            setDailyLog(data)
            let todaysDate = data.date.date
            setDate(todaysDate)
            let recipeList = data.recipes
            setTodaysRecipes(recipeList);
            setLoading(false)
            console.log("today's log: ", data);
            });
        };

      useEffect(() => {
        setLoading(true);
        fetchData();
        const timer = setTimeout(() => { 
            setRendered(true); 
          }, 500); 
       
          return () => clearTimeout(timer); 
      }, [rendered]);
      

        if(loading) {
            return (
            <div>
            <p>Loading...</p>
            <Spinner animation='border'></Spinner>
            </div>
            )
        };
        return (
            <div className='dailyLog'>
                <h1 id ='date'>{date}</h1>
                <div id='calories'>Today's Calories: </div>
                <h2>Today's Meals: </h2>
                {rendered && <DisplayDailyMeals todaysRecipes={todaysRecipes}/>}
                <Button variant="secondary">Remove Meal</Button>
                <EditLog setRefresh = {setRefresh} setRendered = {setRendered} />
            </div>
        )
};