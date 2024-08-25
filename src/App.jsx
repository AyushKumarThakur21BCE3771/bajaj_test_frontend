import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // State variables to manage input, response, and selected options
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState('');

  // Handle JSON input change
  const handleInputChange = (event) => {
    setJsonInput(event.target.value);
    setError(''); // Reset error message on input change
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate JSON input
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data) {
        throw new Error('Invalid JSON format: Missing "data" property');
      }

      const res = await axios.post('https://bajaj-test-backend-1.onrender.com/bfhl', parsedInput);
      setResponse(res.data);
    } catch (error) {
      setError('Invalid JSON format or server error. Please check your input.');
      setResponse(null);
    }
  };

  // Handle dropdown change
  const handleDropdownChange = (event) => {
    setSelectedOptions(Array.from(event.target.selectedOptions, (option) => option.value));
  };

  // Filter and render the response data based on selected options
  const renderResponse = () => {
    if (!response) return null;

    let filteredResponse = {};

    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = response.alphabets;
    }

    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = response.numbers;
    }

    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return (
      <div className="response-output">
        {Object.entries(filteredResponse).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Validator App</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON here, e.g., { "data": ["A", "C", "z"] }'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <>
          <label htmlFor="response-filter">Filter Response:</label>
          <select multiple id="response-filter" onChange={handleDropdownChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
