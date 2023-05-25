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

export const checkStudentID = async (student_id: string) => {
  try {
    const res = await axios.get('http://localhost:3000/id', { params: { student_id } });
    return res;
  } catch (error) {
    throw error;
  }
};

export const confirmNumberSendOTP = async (new_number: string) => {
  try {
    const res = await axios.post('http://localhost:3000/otp/send', 
    JSON.stringify({ mobile_number: new_number }),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    }
    );
    return res;
  } catch (err) {
    throw err;
  }
}
export const confirmNumberVerifyOTP = async (mobile_number: string, otp_code: string) => {
  try {
    const res = await axios.post('http://localhost:3000/otp/verify', 
    JSON.stringify({ mobile_number, otp_code }),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    }
    );
    return res;
  } catch (err) {
    throw err;
  }
}