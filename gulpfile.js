require("dotenv").config();
const gulp = require("gulp");
const fs = require("fs");
const { GoogleSpreadsheet } = require("google-spreadsheet");

async function loadCsv() {
    const sheetId = process.env.REACT_APP_LANGUAGE_SHEET_ID;
    const creds = require("./key.json");
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    const data = [];
    data.push(sheet.headerValues.join());
    rows.map((row) => {
        return data.push(row._rawData.join());
    });
    return data;
}

async function csvToJSON() {
    const rows = await loadCsv();
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
gulp.task("loadCsv", async function () {
    return await loadCsv();
});

gulp.task("csvToJson", async function () {
    return await csvToJSON();
});

gulp.task("default", gulp.series(["csvToJson"]));
