import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../components/uielements/Header";
import { LoginContext } from "../../components/Contexts";

describe("Header", () => {

  test("renders header", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: true }}>
          <Header />
        </LoginContext.Provider>
      </MemoryRouter>
    );
  });

  test("renders logo", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: true }}>
          <Header />
        </LoginContext.Provider>
      </MemoryRouter>
    )
    const logoElement = screen.getByAltText("logo");
    expect(logoElement).toBeInTheDocument();
  });

  test("renders FlipZone", () => {
    render(
      <MemoryRouter>
        <LoginContext.Provider value={{ isLoggedIn: true }}>
          <Header />
        </LoginContext.Provider>
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/FlipZone/i);
    expect(linkElement).toBeInTheDocument();
  });

});
