import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from '../helper/helper';


const baseURL = process.env.REACT_APP_SERVER_DOMAIN;



/** custom hook */
export default function useFetch(query) {
    const [getData, setData] = useState({ isLoading: false, apiData: undefined, status: null, serverError: null })

    useEffect(() => {

        const fetchData = async () => {
            try {
                setData(prev => ({ ...prev, isLoading: true }));

                const { username } = !query ? await getUsername() : '';

                const { data, status } = !query ? await axios.get(`${baseURL}/api/user/${username}`) : await axios.get(`${baseURL}/api${query}`);

                console.log('USEFETCH::', data, status);

                if (status === 201) {
                    setData(prev => ({ ...prev, isLoading: false, apiData: data.user, status: status }));
                }

                setData(prev => ({ ...prev, isLoading: false, apiData: data.user, status: status }));
            } catch (error) {
                setData(prev => ({ ...prev, isLoading: false, serverError: error }))
            }
        };
        fetchData()

    }, [query]);

    return [getData, setData];
}