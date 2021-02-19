export default {
  initial: "clean",
  states: {
    clean: {
      on: {
        "COMMENT.EDIT": "editing",
      },
    },
    editing: {
      on: {
        "COMMENT.POST": "posting",
      },
    },
    posting: {
      on: {
        "COMMENT.POSTED": "posted",
      },
    },
    posted: {
      on: {
        "COMMENT.DELETE": "deleted",
      },
    },
    deleted: {
      type: "final",
    },
  },
};
