var gulp = require("gulp");
const fs = require("fs");

function csvToJSON(csv) {
    const rows = csv.split("\n");
    const jsonArray = [];
    const header = rows[0].split(",");
    let langArr = [];
    rows.map((row, index) => {
        if (index === 0) return null;
        let obj = {};
        let rowData = rows[index].split(",");
        header.map((col, index) => {
            return (obj[header[index]] = rowData[index]);
        });
        return jsonArray.push(obj);
    });
    header.map((col) => {
        if (col === "key") return null;
        jsonArray.map((data, index) => {
            if (index === 0) {
                langArr[col] = {};
            }
            langArr[col][`${data.key}`] = data[col];
            return null;
        });
        if (!fs.existsSync(`src/i18n/locales/${col}`)) {
            fs.mkdirSync(`src/i18n/locales/${col}`);
        }
        fs.writeFileSync(
            `src/i18n/locales/${col}/${col}.json`,
            JSON.stringify(langArr[col])
        );
        return null;
    });
    return jsonArray;
}

gulp.task("csvToJson", async function () {
    return await csvToJSON(
        fs.readFileSync("src/i18n/languageCsv.csv").toString()
    );
});

gulp.task("watch", function () {
    return gulp.watch("src/i18n/languageCsv.csv", gulp.series("csvToJson"));
});

gulp.task("default", gulp.series(["csvToJson", "watch"]));
