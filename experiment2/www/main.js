/*jslint browser, devel */
/*global capacitorExports */
const { CapacitorHttp, registerPlugin } = capacitorExports;
const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");
const watcherOptions = {
  backgroundTitle: "Tracking your location, senõr.",
  backgroundMessage: "Cancel to prevent battery drain.",
  stale: true,
  distanceFilter: 0
};

let id;
async function add_watcher() {
  const interval = 1000 * 60;
  let timestamp = Date.now();
  let currentTime = timestamp;

  await BackgroundGeolocation.addWatcher(watcherOptions, async (location, error) => {
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
      Object.values(error).map(value => JSON.stringify(value));
      return await ping({ ...error });
    }

    console.log(`${ new Date().toLocaleTimeString() }\nLocation had: `, location);

    if (currentTime < (timestamp + interval)) {
      currentTime = Date.now();
      return;
    } else {
      timestamp = Date.now();
      await ping({ location });
    }

  }).then(async the_id => {
    console.log(`Adding watcher ${ the_id }`);
    id = the_id;
  });
}

async function remove_watch(id) {
  if (id !== undefined) {
    await BackgroundGeolocation.removeWatcher(id);
  }
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
