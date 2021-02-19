export default {
  id: "app",
  initial: "Home",
  states: {
    Home: {
      on: {
        CLICK_SIGN_IN: "SignIn",
        CLICK_SIGN_UP: "SignUp",
        CLICK_ARTICLE: "Article",
        CLICK_AUTHOR: "Profile",
        CLICK_TAG: "HomeTag",
      },
    },
    HomeTag: {},
    HomeAuth: {
      on: {
        CLICK_NEW_POST: "Editor",
        CLICK_SETTINGS: "Settings",
        CLICK_MY_PROFILE: "MyProfile",
        CLICK_ARTICLE: "Comment",
      },
    },
    SignIn: {
      on: {
        CLICK_HOME: "Home",
        CLICK_NEED_ACCOUNT: "SignUp",
        SUBMIT_SIGN_IN: "HomeAuth",
      },
    },
    SignUp: {
      on: {
        CLICK_HOME: "Home",
        CLICK_HAVE_ACCOUNT: "SignIn",
        SUBMIT_SIGN_UP: "HomeAuth",
      },
    },
    Article: {
      on: {
        CLICK_AUTHOR: "Profile",
      },
    },
    Comment: {},
    Editor: {
      on: {
        CLICK_HOME: "HomeAuth",
      },
    },
    Profile: {
      on: {
        CLICK_HOME: "Home",
      },
    },
    MyProfile: {
      on: {
        CLICK_HOME: "HomeAuth",
      },
    },
    Settings: {
      on: {
        CLICK_HOME: "HomeAuth",
      },
      // onDone: "MyProfile",
    },
  },
};
