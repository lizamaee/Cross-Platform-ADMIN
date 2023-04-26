import axios from "axios";


export const getAnalyticsData = async () => {
    try {
      const response = await fetchData('user-analytics')
      return response
    } catch (err) {
      throw err
    }
  };

export const getUpcomings = async () => {
    try {
        const response = await fetchData('election/status/upcoming')
        //console.log(response);
        return response
    } catch (err: any) {
        throw err
    }
}
export const getOngoings = async () => {
    try {
        const response = await fetchData('election/status/ongoing')
        return response
    } catch (err: any) {
        throw err
    }
}

export const getVotedActivities = async () => {
  try {
    const response = await fetchData('get-voted-activities')
    //console.log(response);
    return response
  } catch (err: any) {
      //console.log(err.response);
      throw err
  }
}

export const getOrganizationsBasedOnId = async (id:string) => {
  try {
    const response = await fetchData(`election/${id}`)
    return response
  } catch (err) {
    throw err
    //console.log(err);
  }
}

export const getCandidatesBasedOnOrgId = async (id: string) => {
  try {
    const response = await fetchData(`seat/org-seat-candidates/${id}`)
    return response
    
  } catch (error) {
    throw error
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
    

    if (error.response) {
      // ✅ log status code here
      //Live Server Return
      //console.log(error.response.status);
      
      return [error.response.data ];
    }

    //Dead Server Return
    return [{error: error.message }];
  }
}
