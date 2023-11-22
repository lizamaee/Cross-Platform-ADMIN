import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

export const loginadmin = async (student_id: string, password: string) => {
  try {
    const res = await axios.post(`${apiUrl}/login-primary`, 
    JSON.stringify({ student_id, password }),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    }
    )
    return res;
  } catch (err) {
    throw err;
  }
};
export const loginFinaly = async (student_id: string, password: string) => {
  try {
    const res = await axios.post(`${apiUrl}/login`, 
    JSON.stringify({ student_id, password }),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    }
    )
    return res;
  } catch (err) {
    throw err;
  }
};
export const forgotPasswordSendOTP = async (email: string) => {
  try {
    const res = await axios.post(`${apiUrl}/forgot-password-send`,
    JSON.stringify({ email }),
    {
      headers: { "Content-Type": "application/json"}
    }
    )
    return res;
  } catch (err) {
    throw err;
  }
};
export const forgotPassword = async (email: string, new_password: string) => {
  try {
    const res = await axios.patch(`${apiUrl}/forgot-password-outside`,{ email, new_password})
    return res;
  } catch (err) {
    throw err;
  }
};

export const checkStudentID = async (student_id: string) => {
  try {
    const res = await axios.get(`${apiUrl}/id`, { params: { student_id } });
    return res;
  } catch (error) {
    throw error;
  }
};

export const confirmNumberSendOTP = async (new_email: string) => {
  try {
    const res = await axios.post(`${apiUrl}/otp/send`, 
    JSON.stringify({ email: new_email }),
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
export const confirmNumberVerifyOTP = async (email: string, otp_code: string) => {
  try {
    const res = await axios.post(`${apiUrl}/otp/verify`, 
    JSON.stringify({ email, otp_code }),
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

export const registerUser = async (student_id: string, password: string, pin_number: string, mobile_number: string) => {

  try {
    const res = await axios.post(`${apiUrl}/register`, 
    JSON.stringify({ student_id, password, pin_number, mobile_number}),
    {
      headers: { "Content-Type": "application/json"},
      withCredentials: true
    })
    return res
  } catch (err) {
    throw err;
  }

}