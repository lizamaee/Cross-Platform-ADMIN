import axios from "axios";


export const getAnalyticsData = async () => {
    try {
      const response = await fetchData('user-analytics')
      return response
    } catch (err) {
      console.log(err);
    }
  };

export const getUpcomings = async () => {
    try {
        const response = await fetchData('election/status/upcoming')
        //console.log(response);
        return response
    } catch (err: any) {
        throw err.error.message
    }
}
export const getOngoings = async () => {
    try {
        const response = await fetchData('election/status/ongoing')
        return response
    } catch (err: any) {
        throw err.error.message
    }
}

export const getVotedActivities = async () => {
  try {
    const response = await fetchData('get-voted-activities')
    return response
  } catch (err: any) {
      throw err.error.message
      
  }
}

export const getOrganizationsBasedOnId = async (id:string) => {
  try {
    const response = await fetchData(`election/${id}`)
    return response
  } catch (err) {
    console.log(err);
  }
}

export const fetchData = async (endpoints: string) => {
  try {
    const token = localStorage.getItem("adminToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`http://localhost:3000/${endpoints}`, config);
    return response.data
  } catch (error: any) {
    //console.log(error.response.data.error.message)
    return [{ error: error.message }];
  }
}
