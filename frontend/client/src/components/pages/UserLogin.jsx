import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../scripts/services/user';
import { LoginContext, NotificationContext } from '../Contexts';

const UserLogin = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { setIsLoggedIn } = useContext(LoginContext);
  const { setShowNotifWithData } = useContext(NotificationContext);

  let history = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { response, error } = await loginUser(credentials.email, credentials.password);
    if (!response) {
      setShowNotifWithData({
        message: error || "Unknown error occured",
        type: "error"
      });
      setIsLoggedIn(false);
      return;
    }
    setShowNotifWithData({
      message: "Logged in successfully",
      type: "success"
    });
    setIsLoggedIn(true);
    history("/");
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-600 mb-6">Login to FlipZone</h2>
          </div>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email address</label>
              <input
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                aria-describedby="emailHelp"
                onChange={onChange}
                value={credentials.email}
                placeholder="Enter email"
              />
              <small id="emailHelp" className="block text-gray-600 text-xs mt-1">We'll never share your email with anyone else.</small>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <input
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                name="password"
                onChange={onChange}
                value={credentials.password}
                placeholder="Password"
              />
            </div>
            <div className="flex justify-center items-center flex-col">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
              >
                Submit
              </button>
              <p className="text-gray-600 text-sm">
                Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default UserLogin
