import React, { useState } from 'react';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

const TestConnection = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTesting, setIsTesting] = useState(false);

  const runTests = async () => {
    setIsTesting(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Health Check',
        test: () => axios.get(`${API_BASE_URL}/health`)
      },
      {
        name: 'API Endpoint',
        test: () => axios.get(`${API_BASE_URL}/api`)
      },
      {
        name: 'Login Professeur',
        test: () => axios.post(`${API_BASE_URL}/api/auth/login`, {
          username: 'prof',
          password: 'prof123'
        })
      },
      {
        name: 'Login Élève',
        test: () => axios.post(`${API_BASE_URL}/api/auth/login`, {
          username: 'cm2',
          password: 'ecole'
        })
      }
    ];

    for (const test of tests) {
      try {
        const response = await test.test();
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'success',
          data: response.data
        }]);
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          status: 'error',
          error: error.response?.data || error.message
        }]);
      }
    }

    setIsTesting(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🧪 Test de Connexion API
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          API URL: {API_BASE_URL}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Login URL: {API_ENDPOINTS.AUTH.LOGIN}
        </Typography>
      </Paper>

      <Button 
        variant="contained" 
        onClick={runTests} 
        disabled={isTesting}
        sx={{ mb: 2 }}
      >
        {isTesting ? 'Tests en cours...' : 'Lancer les Tests'}
      </Button>

      {testResults.map((result, index) => (
        <Alert 
          key={index}
          severity={result.status === 'success' ? 'success' : 'error'}
          sx={{ mb: 1 }}
        >
          <Typography variant="subtitle2">
            {result.name}: {result.status === 'success' ? '✅ Réussi' : '❌ Échec'}
          </Typography>
          {result.status === 'success' ? (
            <Typography variant="body2">
              {JSON.stringify(result.data, null, 2)}
            </Typography>
          ) : (
            <Typography variant="body2">
              Erreur: {JSON.stringify(result.error, null, 2)}
            </Typography>
          )}
        </Alert>
      ))}
    </Box>
  );
};

export default TestConnection; 