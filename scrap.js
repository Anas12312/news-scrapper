const ObjectsToCsv = require("objects-to-csv");
const csvToObject = require('csv-to-js-parser').csvToObj
const fs = require('fs');
const benzinga = require("./benzinga")
const chartmill = require("./chartmill")
const cnbc = require("./cnbc")
const tradingview = require("./tradingview")
const seekingAlpha = require("./seekingalpha")
const data = fs.readFileSync('test.csv').toString()
const description = {
    company: {
        type: "string",
        group: 1
    },
    title: {
        type: "string",
        group: 1
    },
    text: {
        type: "string",
        group: 1
    },
    imageSrc: {
        type: "string",
        group: 1
    },
    link: {
        type: "string",
        group: 1
    },
    time: {
        type: "string",
        group: 1
    }
}
const news = csvToObject(data, ',', description)

async function run(cb) {
    Promise.all([
        chartmill(),
        cnbc(),
        benzinga(),
        tradingview(),
        seekingAlpha()
    ]).then((values) => {
        cb(values)
    })
}

console.log("before: " + news.length)

run((values) => {
    values.forEach((v) => {
        v.forEach((x, index) => {
            if(news.filter((n) => n.title === x.title).length) return

            news.push(x)
        })
    })
    const csv = new ObjectsToCsv(news);
    console.log("inside: " + news.length)
    // console.log(news)
    
    // csv.toString().then(s => {
    //     console.log(s)
    // });

    csv.toDisk('./test.csv');
})

console.log("after: " + news.length)