import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const FAKE_USER = {
    name: "Jack",
    email: "jack@example.com",
    password: "qwerty",
    avatar: "https://i.pravatar.cc/100?u=zz",
  };
  

const initialValue = {
    user: null,
    isAuthentication: false,
}

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {...state,user: action.payload,isAuthentication:true};
    case "logout":
        return {...state,user:null,isAuthentication:false};
    default:
      throw new Error("Unknown action");
  }
}

function AuthProvider({children}) {
  const [{user,isAuthentication}, dispatch] = useReducer(reducer, initialValue);

    function login(email,password) {
        if (email === FAKE_USER.email && password === FAKE_USER.password) return dispatch({type:"login",payload: FAKE_USER})
    }

    function logout() {
        dispatch({type:"logout"})
    }

  return <AuthContext.Provider value={{user,isAuthentication,login,logout}}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
