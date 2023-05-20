import axios from 'axios';

export const loginadmin = async (id: string, password: string) => {
  try {
    const res = await axios.post('http://localhost:3000/login', 
    JSON.stringify({ student_id: id, password }),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    }
    );
    return res;
  } catch (err) {
    throw err;
  }
};