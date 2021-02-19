export default {
  initial: "clean",
  states: {
    clean: {
      on: {
        "SETTINGS.EDIT": "editing",
        "SETTINGS.LOGOUT": "logged-out",
      },
    },
    editing: {
      on: {
        "SETTINGS.UPDATE": "updating",
      },
    },
    updating: {
      on: {
        "SETTINGS.UPDATED": "updated",
      },
    },
    updated: {
      type: "final",
    },
    "logged-out": {
      type: "final",
    },
  },
};
