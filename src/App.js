import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/test')
        .then(response => {
          setMessage(response.data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
  }, []);

  return (
      <div>
        <h1>{message}</h1>
      </div>
  );
};

export default App;
