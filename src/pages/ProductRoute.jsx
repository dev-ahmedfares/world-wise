import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/FakeAuthContext"
import { useEffect } from "react"

function ProductRoute({children}) {
    const {isAuthentication} = useAuth()
    const navigate = useNavigate()

    useEffect(()=> {
        if (!isAuthentication) navigate("/")
    },[isAuthentication,navigate])

    return isAuthentication ? children : ""
}

export default ProductRoute
