require('isomorphic-fetch')
import cheerio from "cheerio"
import configs from './configs'

const SLACK_HOOK_URL = configs.slack_hook
const WEBSITE_URL = configs.website_url

let prevAptCount: number = 0

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
                .forEach((val) => {
                    if(!(val.name === 'a' &&
                        val.children[1].children[0].data &&
                        parseInt(val.children[1].children[0].data))
                    ) {
                        return
                    }
                    const aptCount = parseInt(val.children[1].children[0].data) 
                    if(aptCount > 0 &&
                       aptCount !== prevAptCount  
                    ) {
                        sendAptAlert(aptCount)
                    }
                    prevAptCount = aptCount
                })
            }
        })
    })
}

const sendAptAlert = (numOfApts: number) => {
    const message = `There are ${numOfApts.toString()} available apartment(s)! Check it!!!! Now!!!! @subbu @jola https://wahlinfastigheter.se/` 
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