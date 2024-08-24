// NOTES Extension of This file does't have to be a jsx because we don't return jsx so it's normal to use .js

import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
    const [searchParams] = useSearchParams()
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")

    return [lat,lng];
}


