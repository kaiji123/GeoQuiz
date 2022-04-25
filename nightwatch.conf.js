const chromedriver = require("chromedriver");

require("dotenv").config();

module.exports = {
  src_folders: ["/e2e"],
  page_objects_path: ["e2e/pages"],
  test_workers: false,

  webdriver: {
    start_process: true,
    port: 9515,
    server_path: chromedriver.path
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          args: ["--no-sandbox"]
        },
      },
    },
  }
};