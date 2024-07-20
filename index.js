const fs = require('fs')
const ObjectToCSV = require('objects-to-csv')
const benzinga = require("./benzinga")
const chartmill = require("./chartmill")
const cnbc = require("./cnbc")
const tradingview = require("./tradingview")
const seekingAlpha = require("./seekingalpha")

console.log("Hello World!")

async function run() {
    Promise.all([
        chartmill(),
        cnbc(),
        benzinga(),
        tradingview(),
        seekingAlpha()
    ]).then((values) => {
        let news = []
        values.forEach((v) => {
            news = news.concat(v)
            // v.forEach((x, index) => {
            //     if(x.title) {
            //         setTimeout(() => {
            //             createDraftPost(x.title, x.text, x.imageSrc, x.link)
            //         }, index * 50)
            //     }
            // })
        })
        const csv = new ObjectToCSV(news);
        console.log(news[5])
        
        // csv.toString().then(s => {
        //     console.log(s)
        // });

        csv.toDisk('./test.csv');
    })
}


// listPosts().then(s => {
//     console.log(s.posts[1])
// })
run()