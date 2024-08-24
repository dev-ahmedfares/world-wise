import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  
} from "react";

const BASE_URL = "https://dev-ahmedfares.github.io/citites-api-json-server/cities.json";

const CitiesContext = createContext();

const initialValue = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true, error: "" };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "currentCity/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "newCity/Added":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload, // to Selected or Active for UI Experiment 😁
      };
    case "city/delete":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialValue
  );
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({})
  // const [error, setError] = useState("")

  useEffect(() => {
    dispatch({ type: "loading" });
    async function fetchCities() {
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        console.log(data)
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        });
      }
    }
    fetchCities();
  }, []);
  
  const fetchCurrentCity = useCallback(
    async function fetchCurrentCity(id) {
      if (Number(id) === currentCity.id) return; // To prevent to fetch currentCity Again

      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        dispatch({ type: "currentCity/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the current city...",
        });
      }
    },
    [currentCity.id]
  );

  async function addNewCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "content-type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Faild to Fetch Data");

      const data = await res.json();

      if (data.Response === "False") throw new Error("⛔ no Data Available");

      dispatch({ type: "newCity/Added", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload:
          err.message || "There was an error loading the current city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/delete", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }
  
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        fetchCurrentCity,
        currentCity,
        addNewCity,
        error,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

// Create custom Hook For useContext

function useCities() {
  const value = useContext(CitiesContext);
  if (value === undefined)
    throw new Error("CitiesContext is used outside the CitiesProvider");
  return value;
}

export { CitiesProvider, useCities };
