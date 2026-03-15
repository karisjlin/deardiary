import { jest } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// api mock is resolved via moduleNameMapper in jest.config.js
import { api, setAuthToken } from "../api/client";

const mockApi = api as jest.Mocked<typeof api>;
const mockSetAuthToken = setAuthToken as jest.MockedFunction<typeof setAuthToken>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const fakeAuthResponse = {
  token: "fake.jwt.token",
  user: { id: 1, username: "alice", email: "alice@example.com", bio: "" },
};

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("signIn", () => {
  it("sets token and user after successful sign in", async () => {
    mockApi.post.mockResolvedValueOnce({ data: fakeAuthResponse });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: "alice@example.com", password: "secret" });
    });

    expect(result.current.token).toBe("fake.jwt.token");
    expect(result.current.user?.username).toBe("alice");
  });

  it("calls setAuthToken with the token", async () => {
    mockApi.post.mockResolvedValueOnce({ data: fakeAuthResponse });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: "alice@example.com", password: "secret" });
    });

    expect(mockSetAuthToken).toHaveBeenCalledWith("fake.jwt.token");
  });

  it("persists auth to localStorage", async () => {
    mockApi.post.mockResolvedValueOnce({ data: fakeAuthResponse });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: "alice@example.com", password: "secret" });
    });

    const stored = JSON.parse(localStorage.getItem("redditclone.auth")!);
    expect(stored.token).toBe("fake.jwt.token");
  });

  it("propagates error when api throws", async () => {
    mockApi.post.mockRejectedValueOnce(new Error("401"));
    const { result } = renderHook(() => useAuth(), { wrapper });

    await expect(
      act(async () => { await result.current.signIn({ email: "bad@bad.com", password: "wrong" }); })
    ).rejects.toThrow();
  });
});

describe("signOut", () => {
  it("clears token, user, and localStorage", async () => {
    mockApi.post.mockResolvedValueOnce({ data: fakeAuthResponse });
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: "alice@example.com", password: "secret" });
    });
    act(() => { result.current.signOut(); });

    expect(result.current.token).toBeNull();
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("redditclone.auth")).toBeNull();
  });
});

describe("restores session from localStorage", () => {
  it("loads stored auth on mount", async () => {
    localStorage.setItem("redditclone.auth", JSON.stringify(fakeAuthResponse));
    const { result } = renderHook(() => useAuth(), { wrapper });

    // wait for useEffect to fire
    await act(async () => {});

    expect(result.current.token).toBe("fake.jwt.token");
    expect(result.current.user?.username).toBe("alice");
  });
});
