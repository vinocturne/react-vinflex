var gulp = require("gulp");
const fs = require("fs");
function csvToJSON(csv) {
    const rows = csv.split("\n");
    const jsonArray = [];
    const header = rows[0].split(",");
    for (let i = 1; i < rows.length; i++) {
        let obj = {};
        let row = rows[i].split(",");
        for (let j = 0; j < header.length; j++) {
            obj[header[j]] = row[j];
        }
        jsonArray.push(obj);
    }

    let ko = {};
    let en = {};
    header.map((e) => {
        if (e === "key") return null;
        jsonArray.map((data) => {
            if (e === "ko") {
                ko[`${data.key}`] = data[e];
            } else if (e === "en") {
                en[`${data.key}`] = data[e];
            }
            return null;
        });
    });
    const koJson = JSON.stringify(ko);
    const enJson = JSON.stringify(en);

    fs.writeFileSync(`src/i18n/locales/ko/page.json`, koJson);
    fs.writeFileSync(`src/i18n/locales/en/page.json`, enJson);
    return jsonArray;
}

gulp.task("csvToJson", function () {
    csvToJSON(fs.readFileSync("src/i18n/languageCsv.csv").toString());
});

gulp.task("watch", function () {
    return gulp.watch("src/i18n/languageCsv.csv", gulp.series("csvToJson"));
});

gulp.task("default", gulp.series(["csvToJson", "watch"]));
