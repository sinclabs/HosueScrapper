require('isomorphic-fetch')
import cheerio from "cheerio"
import configs from './configs'

const SLACK_HOOK_URL = configs.slack_hook
const WEBSITE_URL = configs.website_url

let currentAptCount: number = 0

const checkForApts = () => {
    fetch(WEBSITE_URL)
    .then(res => res.text())
    .then(data => {
        const site = cheerio.load(data)
        site("ul.ojects-term-list")
        .children()
        .each((index, element) => {
            if(index === 1) {
                element.children
                .forEach((val, index) => {
                    if(val.name === 'a' &&
                    val.children[1].children[0].data &&
                    parseInt(val.children[1].children[0].data) &&
                    parseInt(val.children[1].children[0].data) > 0 &&
                    parseInt(val.children[1].children[0].data) !== currentAptCount  
                    ) {
                        sendAptAlert(val.children[1].children[0].data)
                        currentAptCount = parseInt(val.children[1].children[0].data)
                    }
                })
            }
        })
    })
}

const sendAptAlert = (numOfApts: string) => {
    const message = `There are ${numOfApts} available! Check it!!!! Now!!!! @subbu @jola https://wahlinfastigheter.se/` 
    sendMessage(message)
}

const sendMessage = (text: string) => {
    fetch(SLACK_HOOK_URL, {
        method: 'post',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text
        }),
    })
}

(function main() {
    sendMessage("Hurray! I am on a watch B)")
    setInterval(checkForApts, 1000)
})()