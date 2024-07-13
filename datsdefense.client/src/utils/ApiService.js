import axios from 'axios';

// const BASE_URL = 'https://games-test.datsteam.dev'
const BASE_URL = 'https://games.datsteam.dev'
const X_AUTH_TOKEN = '668ee4f86d598668ee4f86d59b';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      'X-Auth-Token': X_AUTH_TOKEN,
      'Content-Type': 'application/json'
    }
  });

export default {
  Participate: async () => {
    let response
      try {
          response = await apiClient.put('/play/zombidef/participate');
          return response.data;
        }
        catch (error) {
          console.log('При вызове метода Participate произошла ошибка: ', error);
          return {
            error: error.response.data?.error ?? ('При вызове метода Participate произошла ошибка: ' + error)
          }
        }
  },
  Command: async(request) => {
    let response
      console.log('Request для метода Command:', request)
      try {
          response = await apiClient.post('/play/zombidef/command', request);
          return response.data;
        }
        catch (error) {
          console.log('При вызове метода Command произошла ошибка: ', error);
          return {
            error: error.response.data?.error ?? ('При вызове метода Command произошла ошибка: ' + error)
          } 
        }
  },
  Units: async() => {
    let response
      try {
          response = await apiClient.get('/play/zombidef/units');
          return response.data;
        }
        catch (error) {
          console.log('При вызове метода Units произошла ошибка: ', error);
          return {
            error: error.response.data?.error ?? ('При вызове метода Units произошла ошибка: ' + error)
          }
        }
  },
  World: async() => {
    let response
    try {
        response = await apiClient.get('/play/zombidef/world');
        return response.data;
      }
      catch (error) {
        console.log('При вызове метода World произошла ошибка: ', error);
        return {
          error: error.response.data?.error ?? ('При вызове метода World произошла ошибка: ' + error)
        }
      }
  },
  GameRounds: async() => {
    let response
    try {
        response = await apiClient.get('/rounds/zombidef');
        return response.data;
      }
      catch (error) {
        console.log('При вызове метода GameRounds произошла ошибка: ', error);
        return {
          error: error.response.data?.error ?? ('При вызове метода GameRounds произошла ошибка: ' + error)
        }
      }
  }
}