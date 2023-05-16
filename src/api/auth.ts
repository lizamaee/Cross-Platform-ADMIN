import axios from 'axios';

export const loginadmin = async (id: string, password: string) => {
  try {
    const res = await axios.post('http://localhost:3000/login', { student_id: id, password });
    return res;
  } catch (err) {
    throw err;
  }
};