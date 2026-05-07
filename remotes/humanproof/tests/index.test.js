import { ThemeProvider } from "@mui/material/styles";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import hostTheme from "../../../host/src/theme";
import HumanProof from "../index";

const renderHumanProof = () =>
  render(
    <ThemeProvider theme={hostTheme}>
      <HumanProof />
    </ThemeProvider>
  );

describe("HumanProof remote", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("switches persona content when tabs are clicked", () => {
    renderHumanProof();

    expect(screen.getByText("Maya")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Publisher$/i }));
    expect(screen.getByText("James")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Watchdog$/i }));
    expect(screen.getByText("Priya")).toBeInTheDocument();
  });

  test("shows validation message for invalid email", async () => {
    renderHumanProof();
    const inputs = screen.getAllByPlaceholderText(/your@email.com/i);
    fireEvent.change(inputs[inputs.length - 1], {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /claim your spot/i }));

    expect(
      await screen.findByText(/Please enter a valid email address/i)
    ).toBeInTheDocument();
  });

  test("submits email successfully", async () => {
    const fetchSpy = jest.fn().mockResolvedValue({});
    global.fetch = fetchSpy;

    renderHumanProof();
    const inputs = screen.getAllByPlaceholderText(/your@email.com/i);
    fireEvent.change(inputs[inputs.length - 1], {
      target: { value: "anthonyv449@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /claim your spot/i }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "https://docs.google.com/forms/d/e/1FAIpQLScUjk_oJ-zlMI3KkqI5bm-REDblOP1u9aBmdrDw2Fhy8WDNAg/formResponse",
        expect.objectContaining({
          method: "POST",
          mode: "no-cors",
        })
      );
    });

    expect(
      await screen.findByRole("button", { name: /on the list/i })
    ).toBeInTheDocument();
  });

  test("shows error message when submission fails", async () => {
    const fetchSpy = jest.fn().mockRejectedValue(new Error("network"));
    global.fetch = fetchSpy;

    renderHumanProof();
    const inputs = screen.getAllByPlaceholderText(/your@email.com/i);
    fireEvent.change(inputs[inputs.length - 1], {
      target: { value: "anthonyv449@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /claim your spot/i }));

    expect(
      await screen.findByText(/Something went wrong/i)
    ).toBeInTheDocument();
  });
});
