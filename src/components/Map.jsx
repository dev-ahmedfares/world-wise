import styles from "./Map.module.css";

import { useNavigate } from "react-router-dom";
import { TileLayer, Marker, Popup, MapContainer, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";


function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 50]);
  const [lat,lng] = useUrlPosition()

    // const allPosition = [...cities.map((city)=> city.position),{lat: mapPosition[0], lng: mapPosition[1]}]


    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition,
      } = useGeolocation();

    useEffect(()=> {
        if (lat && lng)
        setMapPosition([lat,lng])
    },[lat,lng])
    
   useEffect(()=> {
    if (!geolocationPosition) return;
    setMapPosition([geolocationPosition.lat,geolocationPosition.lng])
   },[geolocationPosition])
    
  return (
    <div className={styles.mapContainer}>
        {!geolocationPosition && <Button onclick={getPosition} type={"position"}>
            {isLoadingPosition ? "Loading..." : "use your position"}
        </Button>}

      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
            <Popup>
              <p>{city.cityName}</p>
            </Popup>
          </Marker>
        ))}

        <ChangeCenter mapPosition={mapPosition}/>
        <DetectClick/>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({mapPosition}) {
  const map =  useMap()
    map.setView(mapPosition)
    return null
}

function DetectClick() {
    const nav = useNavigate();
    useMapEvents({
        click:  (e) => nav(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })
}

export default Map;
