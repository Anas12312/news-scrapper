const ObjectsToCsv = require('objects-to-csv');
const { posts, draftPosts } = require('@wix/blog')
const { createClient, OAuthStrategy, ApiKeyStrategy } = require('@wix/sdk')
const { dashboard } = require('@wix/dashboard')
const { members } = require('@wix/members')
const fs = require('fs');
const textTweet = require('./twitter');
const stockTwits = require('./stock');
const { error } = require('console');
const csvToObj = require('csv-to-js-parser').csvToObj

const wixClient = createClient({
    modules: { draftPosts, posts, members },
    auth: ApiKeyStrategy({
        siteId: "eb7bbb97-406e-44b4-8c3e-0b6f9c61c855",
        apiKey: "IST.eyJraWQiOiJQb3pIX2FDMiIsImFsZyI6IlJTMjU2In0.eyJkYXRhIjoie1wiaWRcIjpcIjU5MzExYmY0LWRhY2MtNDJjYS1iZjUyLTI0MmMwNmIyMDJlMFwiLFwiaWRlbnRpdHlcIjp7XCJ0eXBlXCI6XCJhcHBsaWNhdGlvblwiLFwiaWRcIjpcIjFhZTAyYWQ1LTQ0M2UtNDNiOC1hZmUwLWFkMTU2MDYwMTFjZFwifSxcInRlbmFudFwiOntcInR5cGVcIjpcImFjY291bnRcIixcImlkXCI6XCI4NGRjN2VhOC1hNTQyLTQ0YWQtODBlNS0xNTRhMjY3N2VmNDZcIn19IiwiaWF0IjoxNzE4NzE2OTEwfQ.BLfx6eD8ObpVc2VA2pI-vfwGYXyx6yGMVKyBBJtEI2gDxTZjxJDPVcGb6ZQCK5eW3vqMZvRw0ukZs-Ls22o3UPsp6Au3LFlr2axQtxitTDIH07pQ2jGGf3-3_wCBNAAaDPEE0X21EzeYeF8Xst8U8f3ZXPxQS9QiwCHkrFtchYoAW23h4paLa7x_VZkPPqF8CpT5mFL9CCOaU7whRvZiu94erGdDtEnqrhOC_YOdDF29HlwtmlWiyrnLouKz6wdLN68p0rp8NUjf3XWK_tJRK3aofpTHeUq8Nwh35_yV7InZC9lANS2Yt49xrxQ4V-LOAx4E3C5Sch07YvwgF8iApg",
        // accountId: "84dc7ea8-a542-44ad-80e5-154a2677ef46"
    }),
});
async function createDraftPost(title, content, heroImage, url) {
    try {
        const response = await wixClient.draftPosts.createDraftPost(
            {
                title,
                hashtags: ["#slay"],
                coverMedia: {
                    enabled: true,
                    image: 'wix:image://v1/84dc7e_07281732b8634df5a3590017e6a90698~mv2.jpg/logo.jpg#originWidth=980&originHeight=980',
                    displayed: true,
                    custom: false
                },
                richContent: {
                    nodes: [
                        {
                            id: "",
                            type: "IMAGE",
                            imageData: {
                                image: {
                                    src: {
                                        private: false,
                                        url: heroImage
                                    }
                                }
                            }
                        },
                        {
                            id: "",
                            type: "PARAGRAPH",
                            paragraphData: {
                                textStyle: {
                                    textAlignment: "AUTO"
                                },
                                indentation: 0
                            },
                            nodes: [
                                {
                                    id: "",
                                    type: "TEXT",
                                    nodes: [],
                                    textData: {
                                        text: content,
                                        decorations: []
                                    }
                                }
                            ]
                        }]
                },
                // heroImage: "",

                // url,
                memberId: "55e86e98-d429-4084-ba2d-822bafb91276"
            }, {
            publish: true,
            fieldsets: ["CONTENT", "RICH_CONTENT"]
        }
            // draftPost,
            // options,
        );
        return response
    } catch (e) {
        console.log(e)
    }
    // console.log(response)
}
async function listPosts(options) {
    const response = await wixClient.posts.listPosts(options);
    return response
}

async function listMembers(options) {
    const response = await wixClient.members.listMembers(options);
    return response
}

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
const news = csvToObj(data, ',', description)
// console.log(news)
const data2 = fs.readFileSync('posted.csv').toString()

const postedNews = csvToObj(data2, ',', description)

async function run() {
    let index = 0
    console.log(news.length + " --- " + postedNews.length)
    while (!news[index].title || postedNews.filter((p) => p.title === news[index].title).length) {
        index++
    }
    console.log(index)
    if (index < news.length) {
        try {
            console.log(news[index].title)
            const wixResponse = await createDraftPost(news[index].title, news[index].text, news[index].imageSrc, news[index].link)
            postedNews.push(news[index])
            await stockTwits(news[index].title, news[index].link, news[index].imageSrc, news[index].company) //StockTwits
            console.log(wixResponse)
            await textTweet(news[index].title + '\n\n' + news[index].text + '\n\n' + "Find out more on: " + news[index].link, news[index].imageSrc + "\n\n#" + news[index].company)
        } catch (e) {
            console.log(e)
        }
        console.log("closing")
        const csv = new ObjectsToCsv(postedNews);
        csv.toDisk('./posted.csv');
    }
}
run()
setInterval(run, 12 * 60 * 60 * 1000)