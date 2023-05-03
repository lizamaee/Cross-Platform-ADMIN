import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment"
import axios from "axios";

interface Props {
  handleClose: () => void;
  title: string;
}

const CandidatesResults: React.FC<Props> = ({ handleClose, title }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [electionTitle, setElectionTitle] = useState<string>("");

  const [selectedValue, setSelectedValue] = useState<string>("upcoming");

  const [isCreating, setIsCreating] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")

  function handleChange(event: any) {
    setSelectedValue(event.target.value);
  }

  const handleCreate = (e: any) => {
    e.preventDefault();
    setIsCreating(true)

    const token = localStorage.getItem('adminToken');

    const data = {
        title: electionTitle,
        startDate: moment(startDate).utc().format('YYYY-MM-DD'),
        endDate: moment(endDate).utc().format('YYYY-MM-DD')
    }
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    }

    axios.post(`${import.meta.env.VITE_API_URL}election`, data, { headers })
    .then((response) => {
        //console.log('Success:', response.data);
        setIsCreating(false)
        slideSucess()
        
    })
    .catch((error) => {
        console.error('Error:', error);
        setIsCreating(false)
    });
      
    //console.log(electionTitle, selectedValue, start, end);
  };

  const slideSucess = () => {
    setMessage("Election Created")
    setTimeout(() => {
        setMessage("")
    }, 4000)
  }

  return (
    <>
      <div className="shade fixed top-0 left-0  w-full h-screen z-10 bg-[#3333339f]">
        <div className="candidate-wrapper flex justify-center flex-col items-center h-full z-40 ease-in-out transition duration-500">
          <div className="title-btn rounded-t-2xl flex justify-between items-center text-white bg-gradient-to-r from-[#7268EF] to-[#9D93F6] dark:bg-[#596374] py-3 px-5 w-5/6 md:w-3/6 dark:border-b dark:border-gray-600">
            <h2 className="px-6 pop-bold lg:text-xl ">{title}</h2>
            <button
              onClick={handleClose}
              className="text-white dark:text-[#b7bfcd] sticky z-50 hover:bg-[#887df3e9] dark:hover:bg-gray-600 p-2 rounded-xl"
            >
              <IoClose size={30} />
            </button>
          </div>

          <div className="centered relative w-5/6 md:w-3/6 bg-white dark:bg-[#4a4a4a] h-5/6 md:h-4/6 rounded-b-2xl">
            <div className="form-container">
              <form>
                <div className="election-title py-10 px-5 gap-4 md:flex items-center justify-between relative overflow-hidden">
                    <span className={`absolute bg-gray-100 px-2 py-1 text-green-400 pop-medium rounded-l-sm border-l-2 border-green-300 top-1 right-0 transition-all duration-500 ease-in-out ${message ? 'translate-x-0' : 'translate-x-full' }`}>{message}</span>
                  <div className="title-wrapper flex-1 py-3">
                    <label className="pop-semibold">Title</label>
                    <br />
                    <input
                      value={electionTitle}
                      onChange={(e) => setElectionTitle(e.target.value)}
                      placeholder="Enter your title"
                      className="bg-[#e1e1e1] shadow-sm border-[1px] w-full  border-slate-200 py-2 px-3 rounded-lg outline-none pop-regular"
                      type="text"
                      required
                    />
                  </div>
                  <div className="status-wrapper">
                    <label className="pop-semibold">Status</label>
                    <br />
                    <select
                      value={selectedValue}
                      onChange={handleChange}
                      className="bg-[#e1e1e1] shadow-sm border-[1px] border-slate-200 py-2 px-3 rounded-lg outline-none pop-regular"
                    >
                      <option value="upcoming">upcoming</option>
                      <option value="ongoing">ongoing</option>
                    </select>
                  </div>
                </div>

                <div className="dates md:flex justify-between px-5 py-5">
                  <div className="start">
                    <label className="pop-semibold text-gray-900">
                      Start Date
                    </label>
                    <DatePicker
                      selected={startDate ?? null}
                      onChange={(date) => setStartDate(date)}
                      showIcon
                      required
                      isClearable
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="nothing!"
                      className="pop-regular shadow-sm bg-[#e1e1e1] border-[1px] w-[70%] border-slate-200 rounded-lg outline-none px-4"
                    />
                  </div>
                  <div className="end">
                    <label className="pop-semibold text-gray-900">
                      End Date
                    </label>
                    <DatePicker
                      showIcon
                      required
                      isClearable
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="nothing!"
                      className="pop-regular shadow-sm bg-[#e1e1e1] border-[1px] w-[70%] border-slate-200 rounded-lg outline-none px-4"
                      selected={endDate ?? null}
                      onChange={(date) => setEndDate(date)}
                    />
                  </div>
                </div>
                <div className="btn-wrapper flex justify-center items-center py-5">
                  {isCreating && (<button
                    onClick={handleCreate}
                    type="submit"
                    className="py-3 px-4 md:px-6 rounded-3xl text-white pop-semibold shadow-xl hover:bg-blue-800 bg-[#3961ee]"
                  >
                    Creating...
                  </button>)}
                  {!isCreating && (<button
                    onClick={handleCreate}
                    type="submit"
                    className="py-3 px-4 md:px-6 rounded-3xl text-white pop-semibold shadow-xl hover:bg-blue-800 bg-[#3961ee]"
                  >
                    Create
                  </button>)}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidatesResults;
