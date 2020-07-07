import { useHistory } from 'react-router-dom';
import axios from 'axios'

export default () => {
    const history = useHistory();

    return axios.get(`/api/checkauth`)
        .then(response => {

            if (response.data.auth) {
                history.push('/message')
            }

        }).then(()=> false )

}