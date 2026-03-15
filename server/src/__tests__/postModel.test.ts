import { jest } from "@jest/globals";

const mockQuery = jest.fn();

await jest.unstable_mockModule("pg", () => ({
  Pool: jest.fn(() => ({ query: mockQuery })),
}));

await jest.unstable_mockModule("../models/communityModel.js", () => ({
  findOrCreateCommunity: jest.fn().mockResolvedValue({ id: 1, name: "general" }),
}));

const { listPosts, createPost, toggleLike } = await import("../models/postModel.js");

beforeEach(() => mockQuery.mockReset());

describe("listPosts", () => {
  it("returns rows from the query", async () => {
    const fakeRows = [{ id: 1, title: "Hello", community: ["general"] }];
    mockQuery.mockResolvedValueOnce({ rows: fakeRows });
    const result = await listPosts(null);
    expect(result).toEqual(fakeRows);
  });

  it("orders by created_at DESC for sort=recent", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    await listPosts(null, "recent");
    const sql = mockQuery.mock.calls[0][0] as string;
    expect(sql).toMatch(/p\.created_at DESC/);
  });

  it("orders by likes_count DESC for sort=top", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    await listPosts(null, "top");
    const sql = mockQuery.mock.calls[0][0] as string;
    expect(sql).toMatch(/likes_count DESC/);
  });

  it("passes viewerId=0 when viewer is null", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    await listPosts(null);
    expect(mockQuery.mock.calls[0][1]).toEqual([0]);
  });
});

describe("createPost", () => {
  it("normalises community names to lowercase", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    await createPost(1, "Title here", "Body text here okay", ["General", "CATS"]);
    const params = mockQuery.mock.calls[0][1] as unknown[];
    expect(params[3]).toEqual(["general", "cats"]);
  });
});

describe("toggleLike", () => {
  it("deletes existing like and returns false", async () => {
    mockQuery
      .mockResolvedValueOnce({ rowCount: 1 })
      .mockResolvedValueOnce({ rowCount: 1 });
    const result = await toggleLike(1, 10);
    expect(result).toBe(false);
    const deleteSql = mockQuery.mock.calls[1][0] as string;
    expect(deleteSql).toMatch(/DELETE/);
  });

  it("inserts new like and returns true", async () => {
    mockQuery
      .mockResolvedValueOnce({ rowCount: 0 })
      .mockResolvedValueOnce({ rowCount: 1 });
    const result = await toggleLike(1, 10);
    expect(result).toBe(true);
    const insertSql = mockQuery.mock.calls[1][0] as string;
    expect(insertSql).toMatch(/INSERT/);
  });
});
