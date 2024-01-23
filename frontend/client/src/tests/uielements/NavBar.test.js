import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NavBar from "../../components/uielements/NavBar";
import { LoginContext } from "../../components/Contexts";

describe("NavBar", () => {

  test("renders without 'User' link when logged in", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: true }}>
          <NavBar isLoggedIn={true} />
        </LoginContext.Provider>
      </MemoryRouter>
    );
    const linkElement = screen.queryByText(/User/i);
    expect(linkElement).not.toBeInTheDocument();
  });

  test("renders with 'User' link when not logged in", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: false }}>
          <NavBar isLoggedIn={false} />
        </LoginContext.Provider>
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/User/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("renders with 'Home' link when not logged in", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: false }}>
          <NavBar isLoggedIn={false} />
        </LoginContext.Provider>
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/Home/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("renders with 'Products' link when logged in", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: true }}>
          <NavBar isLoggedIn={true} />
        </LoginContext.Provider>
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/Products/i);
    expect(linkElement).toBeInTheDocument();
  });

  test("renders with 'cart'", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: true }}>
          <NavBar isLoggedIn={true} />
        </LoginContext.Provider>
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/Cart/i);
    expect(linkElement).toBeInTheDocument();
  });

});
