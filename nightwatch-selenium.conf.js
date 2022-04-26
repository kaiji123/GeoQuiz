const chromedriver = require("chromedriver");

require("dotenv").config();

module.exports = {
  src_folders: ["/e2e"],
  page_objects_path: ["e2e/pages"],

  test_workers: false,

  selenium: {
    start_process: false,

    cli_args: {
      "webdriver.chrome.driver": chromedriver.path
    }
  },

  webdriver: {
    start_process: false
  },

  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: "${SELENIUM_HOST}",

      screenshots: {
        enabled: false,
        path: "tests_output/",
        on_failure: true
      },

      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          w3c: false,
          args: ["--no-sandbox"]
        }
      }
    }
  }
};