/*jslint browser, devel */
/*global capacitorExports */
const { CapacitorHttp, registerPlugin } = capacitorExports;
const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");

const watcherOptions = {
  backgroundTitle: "Tracking your location, senõr.",
  backgroundMessage: "Cancel to prevent battery drain.",
  stale: true,
  distanceFilter: 5
};

async function add_watcher() {
  let id;
  let done = false;
  await BackgroundGeolocation.addWatcher(watcherOptions, async (location, error) => {
    if (done) {
      return;
    } else {
      done = true;
    }

    if (error) {
      console.log(`${ new Date().toLocaleTimeString() }\nFailed to get location: `, error);
      if (
        error.code === "NOT_AUTHORIZED" &&
        window.confirm(
            "This app needs your location, " +
            "but does not have permission.\n\n" +
            "Open settings now?"
          )
      ) {
        BackgroundGeolocation.openSettings();
      }
      return log_error(error, watcher_colours[id]);
    }

    console.log(`${ new Date().toLocaleTimeString() }\nLocation had: `, location);
    await ping({ location });


  }).then(async the_id => {
    console.log(`Adding watcher ${ the_id }`);
    id = the_id;
  });
}

async function ping(additionalParams) {
  const options = {
    url: "http://10.1.10.164:8083",
    headers: { "content-type": "application/json" },
    data: {
      app: "Example",
      ...additionalParams
    }
  };

  await CapacitorHttp.post(options)
    .then(async res => {
      console.log("Echo response: ", res);
    });
}
