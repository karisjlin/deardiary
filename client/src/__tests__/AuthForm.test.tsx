import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();

await jest.unstable_mockModule("../context/AuthContext.js", () => ({
  useAuth: () => ({
    token: null,
    user: null,
    signIn: mockSignIn,
    signUp: mockSignUp,
    signOut: jest.fn(),
  }),
  AuthContext: { Provider: ({ children }: { children: React.ReactNode }) => children },
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const { AuthForm } = await import("../components/AuthForm.js");

beforeEach(() => jest.clearAllMocks());

describe("AuthForm", () => {
  it("defaults to signup mode with Username field visible", async () => {
    render(<AuthForm />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it("hides Username field in signin mode", async () => {
    render(<AuthForm />);
    await userEvent.click(screen.getByRole("tab", { name: /sign in/i }));
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument();
  });

  it("calls signUp with form values on signup submit", async () => {
    mockSignUp.mockResolvedValueOnce(undefined);
    render(<AuthForm />);

    await userEvent.type(screen.getByLabelText(/username/i), "alice");
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(mockSignUp).toHaveBeenCalledWith({
      username: "alice",
      email: "alice@example.com",
      password: "secret123",
    });
  });

  it("calls signIn on signin submit", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    render(<AuthForm />);

    await userEvent.click(screen.getByRole("tab", { name: /sign in/i }));
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignIn).toHaveBeenCalledWith({
      email: "alice@example.com",
      password: "secret123",
    });
  });

  it("shows error alert when auth fails", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("401"));
    render(<AuthForm />);

    await userEvent.click(screen.getByRole("tab", { name: /sign in/i }));
    await userEvent.type(screen.getByLabelText(/email/i), "bad@bad.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("calls onSuccess after successful auth", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    const onSuccess = jest.fn();
    render(<AuthForm onSuccess={onSuccess as () => void} />);

    await userEvent.click(screen.getByRole("tab", { name: /sign in/i }));
    await userEvent.type(screen.getByLabelText(/email/i), "alice@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "secret123");
    await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(onSuccess).toHaveBeenCalled();
  });
});
