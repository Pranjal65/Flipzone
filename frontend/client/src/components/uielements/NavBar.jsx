import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser, useGetLoginStatus } from "../../scripts/services/user";
import { NotificationContext, LoginContext } from '../Contexts';

/**
 * Only contains links to other pages like home, user and cart.
 * Is used in the header of the page.
 * @param {React.PropsWithChildren} props - React props
 * @returns {JSX.Element} - NavBar component
 */
export default function NavBar(props) {

  // verify that setPage is a function
  const listItemStyle = "m-4 font-semibold color-fg-accent hover:text-purple-500";
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(LoginContext);
  const { setShowNotifWithData } = useContext(NotificationContext);

  const handleLogout = async () => {
    const { response, error } = await logoutUser();
    if (error) {
      setShowNotifWithData({
        message: error || "Unknown error occured",
        type: "error"
      });
      return;
    }
    setShowNotifWithData({
      message: response || "Successfully logged out",
      type: "success"
    });
    setIsLoggedIn(false);
    navigate("/login");
  }

  return (
    <nav className="flex justify-between items-center">
      <ul className="flex list-none">
        <li>
          <Link to="/" className={listItemStyle}>
            <i className="fas fa-home"></i>
            &nbsp; {useGetLoginStatus() ? "Products" : "Home"} </Link>
        </li>

        {!useGetLoginStatus() ?
          <li>
            <Link to="/login" className={listItemStyle}>
              <i className="fas fa-user"></i>
              &nbsp; Register / Login </Link>
          </li>
          :
          <li>
            <button
              onClick={async () => handleLogout()}
              className='mx-4 font-semibold color-fg-accent hover:text-purple-500'
            >
              <i className="fas fa-user"></i>
              &nbsp; Logout
            </button>
          </li>
        }

        <li>
          <Link to="/cart" className={listItemStyle}>
            <i className="fas fa-shopping-cart"></i>
            &nbsp; Cart </Link>
        </li>
      </ul>
    </nav>
  );
}
