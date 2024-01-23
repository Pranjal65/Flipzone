import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../scripts/services/user';
import { LoginContext, NotificationContext } from '../Contexts';

const UserRegistration = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const { setIsLoggedIn } = useContext(LoginContext);
  const { setShowNotifWithData } = useContext(NotificationContext);

  const history = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { response, error } = await registerUser(credentials.name, credentials.email, credentials.password);
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
            <h2 className="text-4xl font-extrabold text-blue-600 mb-6">SignUp to FlipZone</h2>
          </div>
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                name="name"
                aria-describedby="emailHelp"
                placeholder="Enter your name"
                onChange={onChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email address</label>
              <input
                type="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                onChange={onChange}
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
                placeholder="Password"
                onChange={onChange}
                minLength={5}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cpassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <input
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cpassword"
                name="cpassword"
                placeholder="Confirm Password"
                onChange={onChange}
                minLength={5}
                required
              />
            </div>
            <div className="flex justify-center items-center flex-col">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
              <p className="text-gray-600 text-sm">
                Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default UserRegistration
