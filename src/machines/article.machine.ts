import {
  createMachine,
  actions,
  assign,
  spawn,
  ActorRef,
  EventObject
} from "xstate";
import { get, post, del } from "../utils/api-client";
import { history } from "../utils/history";
import type {
  ArticleResponse,
  Article,
  CommentListResponse,
  CommentResponse,
  Comment,
  Errors,
  ProfileResponse
} from "../types/api";

const { choose } = actions;

type ArticleContext = {
  slug: string;
  article?: Article;
  comments?: Comment[];
  deletingRef?: ActorRef<EventObject>;
  creatingCommentRef?: ActorRef<EventObject>;
  deletingCommentRef?: ActorRef<EventObject>;
  favoritingRef?: ActorRef<EventObject>;
  followingRef?: ActorRef<EventObject>;
};

type ArticleEvent =
  | {
      type: "done.invoke.getArticle";
      data: ArticleResponse;
    }
  | {
      type: "error.platform";
      data: { errors: Errors };
    }
  | {
      type: "done.invoke.deletingArticle";
    }
  | {
      type: "done.invoke.getComments";
      data: CommentListResponse;
    }
  | {
      type: "done.invoke.creatingComment";
      data: CommentResponse;
    }
  | {
      type: "CREATE_COMMENT";
      comment: { body: string };
    }
  | {
      type: "TOGGLE_FOLLOW";
      username: string;
    }
  | {
      type: "TOGGLE_FAVORITE";
    }
  | {
      type: "DELETE_ARTICLE";
    }
  | {
      type: "DELETE_COMMENT";
      id: Comment["id"];
    }
  | {
      type: "done.invoke.favoriting";
      data: ArticleResponse;
    }
  | {
      type: "done.invoke.following";
      data: ProfileResponse;
    };

type ArticleState =
  | {
      value:
        | "article"
        | { article: "fetching" }
        | "comments"
        | { comments: "fetching" };
      context: ArticleContext & {
        article: undefined;
        comments: undefined;
      };
    }
  | {
      value: { article: "hasContent" };
      context: ArticleContext & {
        article: Article;
      };
    }
  | {
      value: { comments: "hasContent" };
      context: ArticleContext & {
        comments: Comment[];
      };
    }
  | {
      value: { comments: "noContent" };
      context: ArticleContext & {
        comments: [];
      };
    };

export const articleMachine = createMachine<
  ArticleContext,
  ArticleEvent,
  ArticleState
>(
  {
    id: "article",
    type: "parallel",
    states: {
      article: {
        initial: "fetching",
        states: {
          fetching: {
            invoke: {
              id: "getArticle",
              src: "getArticle",
              onDone: {
                target: "hasContent",
                actions: "assignArticleData"
              }
            }
          },
          hasContent: {
            on: {
              TOGGLE_FOLLOW: {
                actions: choose([
                  {
                    actions: "goToSignup",
                    cond: "notAuthenticated"
                  },
                  {
                    actions: "followAuthor",
                    cond: "notFollowing"
                  },
                  {
                    actions: "unfollowAuthor"
                  }
                ])
              },
              TOGGLE_FAVORITE: {
                actions: choose([
                  {
                    actions: "goToSignup",
                    cond: "notAuthenticated"
                  },
                  {
                    actions: "deleteFavorite",
                    cond: "articleIsFavorited"
                  },
                  {
                    actions: "favoriteArticle"
                  }
                ])
              },
              "done.invoke.favoriting": {
                actions: "assignArticleData"
              },
              DELETE_ARTICLE: {
                actions: "deleteArticle"
              },
              "done.invoke.deletingArticle": {
                actions: "goHome"
              }
            }
          }
        }
      },
      comments: {
        initial: "fetching",
        states: {
          fetching: {
            invoke: {
              id: "getComments",
              src: "getComments",
              onDone: [
                {
                  target: "hasContent",
                  cond: "hasCommentContent",
                  actions: "assignCommentData"
                },
                {
                  target: "noContent",
                  actions: "assignCommentData"
                }
              ]
            }
          },
          hasContent: {
            on: {
              CREATE_COMMENT: {
                actions: "createComment"
              },
              DELETE_COMMENT: [
                {
                  target: "noContent",
                  cond: "isOnlyComment",
                  actions: "deleteComment"
                },
                {
                  actions: "deleteComment"
                }
              ]
            }
          },
          noContent: {
            on: {
              CREATE_COMMENT: {
                target: "hasContent",
                actions: "createComment"
              }
            }
          }
        },
        on: {
          "done.invoke.creatingComment": {
            actions: "assignNewComment"
          }
        }
      }
    }
  },
  {
    actions: {
      assignArticleData: assign({
        article: (context, event) => {
          if (event.type === "done.invoke.getArticle") {
            return event.data.article;
          }
          return context.article;
        }
      }),
      assignCommentData: assign({
        comments: (context, event) => {
          if (event.type === "done.invoke.getComments") {
            return event.data.comments;
          }
          return context.comments;
        }
      }),
      goToSignup: () => history.push("/register"),
      goHome: () => history.push("/"),
      deleteArticle: assign({
        deletingRef: context =>
          spawn(del(`articles/${context.slug}`), "deletingArticle")
      }),
      createComment: assign({
        creatingCommentRef: (context, event) => {
          if (event.type === "CREATE_COMMENT") {
            return spawn(
              post<CommentResponse, { comment: Pick<Comment, "body"> }>(
                `articles/${context.slug}/comments`,
                { comment: event.comment }
              ),
              "creatingComment"
            );
          }
          return context.creatingCommentRef;
        }
      }),
      deleteComment: assign((context, event) => {
        if (event.type === "DELETE_COMMENT") {
          return {
            ...context,
            deletingCommentRef: spawn(
              del(`articles/${context.slug}/comments/${event.id}`)
            ),
            comments:
              context.comments?.filter(comment => comment.id !== event.id) || []
          };
        }
        return context;
      }),
      deleteFavorite: assign((context, event) => {
        if (event.type === "TOGGLE_FAVORITE") {
          const article: Article = {
            ...context.article!,
            favorited: false,
            favoritesCount: context.article!.favoritesCount - 1
          };

          return {
            ...context,
            article,
            favoriteRef: spawn(
              del<ArticleResponse>(`articles/${context.slug}/favorite`),
              "favoriting"
            )
          };
        }
        return context;
      }),
      favoriteArticle: assign((context, event) => {
        if (event.type === "TOGGLE_FAVORITE") {
          const article: Article = {
            ...context.article!,
            favorited: true,
            favoritesCount: context.article!.favoritesCount + 1
          };
          return {
            ...context,
            article,
            favoriteRef: spawn(
              post<ArticleResponse>(
                `articles/${context.slug}/favorite`,
                undefined
              ),
              "favoriting"
            )
          };
        }
        return context;
      }),
      followAuthor: assign((context, event) => {
        if (event.type === "TOGGLE_FOLLOW") {
          return {
            ...context,
            followingRef: spawn(
              post<ProfileResponse>(
                `profiles/${event.username}/follow`,
                undefined
              )
            ),
            article: {
              ...context.article!,
              author: {
                ...context.article!.author,
                following: true
              }
            }
          };
        }
        return context;
      }),
      unfollowAuthor: assign((context, event) => {
        if (event.type === "TOGGLE_FOLLOW") {
          return {
            ...context,
            followingRef: spawn(
              del<ProfileResponse>(`profiles/${event.username}/follow`)
            ),
            article: {
              ...context.article!,
              author: {
                ...context.article!.author,
                following: false
              }
            }
          };
        }
        return context;
      }),
      assignNewComment: assign({
        comments: (context, event) => {
          if (event.type === "done.invoke.creatingComment") {
            return [event.data.comment].concat(context.comments!);
          }
          return context.comments;
        }
      })
    },
    guards: {
      hasCommentContent: (_context, event) => {
        if (event.type === "done.invoke.getComments") {
          return !!event.data.comments.length;
        }
        return false;
      },
      isOnlyComment: context => context.comments?.length === 1,
      notFollowing: context => !context.article?.author?.following,
      articleIsFavorited: context => !!context.article?.favorited
    },
    services: {
      getArticle: context => get<ArticleResponse>(`articles/${context.slug}`),
      getComments: context =>
        get<CommentListResponse>(`articles/${context.slug}/comments`)
    }
  }
);
