import styles from './CountryList.module.css'

import CountryItem from './CountryItem'
import Message from './Message'
import Spinner from "./Spinner"
import { useCities } from '../contexts/CitiesContext'


function CountryList() {
    const {isLoading,cities} = useCities()
    if (isLoading) return <Spinner/>

    if (!cities.length) return <Message message={"Add your first city by clicking on a city on the map"}/>

    const countries = cities.reduce((acc,ele)=> {
        if (!acc.map((e)=> e.country ).includes(ele.country))
            return [...acc,{country: ele.cityName,emoji:ele.emoji}]
        else return acc
        
    },[])

    return (
        <ul className={styles.countryList}>
           {countries.map((country)=> <CountryItem key={country.country}  country={country}/>)}
        </ul>
    )
}

export default CountryList
