import { useHistory } from 'react-router-dom';

export default () => {
    const history = useHistory();

    return axios.get('/api/checkauth')
        .then(response => {

            if (response.data.auth) {
                history.push('/chat')
            }

        }).then(()=> false )

}