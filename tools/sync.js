const syncDirectory = require("sync-directory");
const path = require("path");

// const ROOT = "./";
const ROOT = "../packages";

const LIBS = ["next", "react", "utils"];

const TARGETS = [
  //{ dir: "../knitkode/libs/koine", nx: true },
  { dir: "../../../MKLR/mklr/libs", nx: false },
  // { dir: "../../../XX", nx: true },
];

LIBS.forEach((lib) => {
  let src = path.join(__dirname, ROOT, `/${lib}`);

  TARGETS.forEach(({ dir, nx }) => {
    let dest = path.join(__dirname, dir, `/${lib}`);
    const destRelative = path.relative("../../", dest).split("/")[0];

    if (!nx) {
      src = path.join(src, "");
      dest = path.join(dest, "");
    }
    console.log(`syncing ${lib} to ${destRelative}`);

    syncDirectory.sync(src, dest, {
      watch: true,
      type: "copy",
      exclude: ["node_modules"],
      deleteOrphaned: true,
      afterEachSync({
        eventType,
        // nodeType,
        relativePath,
        // srcPath,
        // targetPath,
      }) {
        if (!eventType.startsWith("init:")) {
          console.log(`${eventType} ${relativePath}, ${lib} to ${destRelative}`);
        }
      },
    });
  });
});
