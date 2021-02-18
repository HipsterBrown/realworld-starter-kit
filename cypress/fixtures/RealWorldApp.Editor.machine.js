// import { sendParent } from "xstate";

export default {
  initial: "clean",
  states: {
    clean: {
      on: {
        EDIT_TITLE: "editing",
      },
    },
    editing: {
      on: {
        SUBMIT_INCOMPLETE: "errored",
        SUBMIT_COMPLETE: "publishing",
      },
    },
    errored: {
      on: {
        SUBMIT_COMPLETE: "publishing",
      },
    },
    publishing: {
      on: {
        PUBLISH_COMPLETE: "published",
        // PUBLISH_COMPLETE: {
        //   target: "published",
        //   actions: sendParent("PUBLISHED"),
        // },
      },
    },
    published: {},
  },
};
