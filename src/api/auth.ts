import axios from 'axios';

export const loginadmin = async (username: string, password: string) => {
  try {
    const res = await axios.post('http://localhost:3000/admin/login', { username, password });
    return res;
  } catch (err) {
    throw err;
  }
};