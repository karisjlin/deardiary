import { jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import type { Post } from "../types";

const mockPost: Post = {
  id: 1,
  title: "Test post title",
  body: "This is the post body content.",
  community: ["general", "cats"],
  created_at: "2026-01-01T00:00:00Z",
  author_id: 42,
  author_username: "alice",
  likes_count: 5,
  favourites_count: 2,
  comments_count: 3,
  liked_by_me: false,
  favourited_by_me: false,
};

const onLike = jest.fn().mockResolvedValue(undefined);
const onFavourite = jest.fn().mockResolvedValue(undefined);

const renderCard = (overrides: Partial<Post> = {}, extras: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter>
      <PostCard post={{ ...mockPost, ...overrides }} onLike={onLike} onFavourite={onFavourite} {...extras} />
    </MemoryRouter>
  );

beforeEach(() => jest.clearAllMocks());

describe("PostCard", () => {
  it("renders title, body and author", () => {
    renderCard();
    expect(screen.getByText("Test post title")).toBeInTheDocument();
    expect(screen.getByText("This is the post body content.")).toBeInTheDocument();
    expect(screen.getByText("@alice")).toBeInTheDocument();
  });

  it("renders community chips with d/ prefix", () => {
    renderCard();
    expect(screen.getByText("d/general")).toBeInTheDocument();
    expect(screen.getByText("d/cats")).toBeInTheDocument();
  });

  it("like button is outlined when not liked", () => {
    renderCard({ liked_by_me: false });
    const likeBtn = screen.getByRole("button", { name: /likes/i });
    expect(likeBtn).toHaveClass("MuiButton-outlined");
  });

  it("like button is contained when liked", () => {
    renderCard({ liked_by_me: true });
    const likeBtn = screen.getByRole("button", { name: /likes/i });
    expect(likeBtn).toHaveClass("MuiButton-contained");
  });

  it("calls onLike with post id when like button clicked", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: /likes/i }));
    expect(onLike).toHaveBeenCalledWith(1);
  });

  it("calls onFavourite with post id when favourite button clicked", async () => {
    renderCard();
    await userEvent.click(screen.getByRole("button", { name: /favourites/i }));
    expect(onFavourite).toHaveBeenCalledWith(1);
  });

  it("shows correct comment count", () => {
    renderCard({ comments_count: 7 });
    expect(screen.getByText(/7 Comments/i)).toBeInTheDocument();
  });

  it("does not show edit/delete buttons when props are absent", () => {
    renderCard();
    expect(screen.queryByTestId("EditRoundedIcon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("DeleteOutlineRoundedIcon")).not.toBeInTheDocument();
  });

  it("shows delete confirmation dialog when delete icon clicked", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    renderCard({}, { onDelete });
    const deleteBtn = screen.getByTestId("DeleteOutlineRoundedIcon").closest("button")!;
    await userEvent.click(deleteBtn);
    expect(await screen.findByText(/delete post\?/i)).toBeInTheDocument();
  });

  it("calls onDelete when confirmed", async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    renderCard({}, { onDelete });
    await userEvent.click(screen.getByTestId("DeleteOutlineRoundedIcon").closest("button")!);
    await userEvent.click(await screen.findByRole("button", { name: /^delete$/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });
});
