import { jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

const mockVerifyToken = jest.fn();

await jest.unstable_mockModule("../utils/jwt.js", () => ({
  verifyToken: mockVerifyToken,
  signToken: jest.fn(),
}));

const { requireAuth, optionalAuth } = await import("../middleware/auth.js");

const makeReq = (authHeader?: string) =>
  ({ headers: { authorization: authHeader }, user: undefined } as unknown as Request);

const makeRes = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res) as unknown as Response["status"];
  res.json = jest.fn().mockReturnValue(res) as unknown as Response["json"];
  return res;
};

const next = jest.fn() as unknown as NextFunction;

beforeEach(() => jest.clearAllMocks());

describe("requireAuth", () => {
  it("returns 401 when no Authorization header", () => {
    const res = makeRes();
    requireAuth(makeReq(), res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("returns 401 when header is not Bearer", () => {
    const res = makeRes();
    requireAuth(makeReq("Basic abc123"), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets req.user when token is valid", () => {
    const fakeUser = { id: 1, username: "alice" };
    mockVerifyToken.mockReturnValueOnce(fakeUser);
    const req = makeReq("Bearer valid.token.here");
    requireAuth(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(fakeUser);
  });

  it("returns 401 when verifyToken throws", () => {
    mockVerifyToken.mockImplementationOnce(() => { throw new Error("expired"); });
    const res = makeRes();
    requireAuth(makeReq("Bearer bad.token"), res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("optionalAuth", () => {
  it("calls next with no header, leaving req.user undefined", () => {
    const req = makeReq();
    optionalAuth(req, makeRes(), next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it("sets req.user when token is valid", () => {
    const fakeUser = { id: 2, username: "bob" };
    mockVerifyToken.mockReturnValueOnce(fakeUser);
    const req = makeReq("Bearer valid.token");
    optionalAuth(req, makeRes(), next);
    expect(req.user).toEqual(fakeUser);
    expect(next).toHaveBeenCalled();
  });

  it("still calls next when token is invalid", () => {
    mockVerifyToken.mockImplementationOnce(() => { throw new Error("bad"); });
    const req = makeReq("Bearer bad.token");
    optionalAuth(req, makeRes(), next);
    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalled();
  });
});
