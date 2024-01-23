import { render, screen } from "@testing-library/react";
import Notification from "../../components/uielements/Notification";

describe("Notification", () => {

  test("renders notification", () => {
    render(<Notification message="test" type="success" setShowNotifWithData={() => undefined} />);
  });

  /* test("notification eventually disappears", () => {
    render(
      <Notification message="test" type="success" setShowNotifWithData={() => undefined} />
    );
    setTimeout(() => {
      const linkElement = screen.queryByText(/test/i);
      expect(linkElement).not.toBeInTheDocument();
    }, 10000);
  }); */

  /* test("success and error notifications have different background colors", () => {
    render(<Notification message="test1" type="success" setShowNotifWithData={() => undefined} />);
    const linkElement = screen.getByText(/test1/i);
    render(<Notification message="test2" type="error" setShowNotifWithData={() => undefined} />);
    const linkElement2 = screen.getByText(/test2/i);

    const successColor = linkElement.style.backgroundColor;
    expect(linkElement2).not.toHaveStyle(`background-color: ${successColor}`);
  }); */

});
