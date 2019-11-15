require('isomorphic-fetch')
import cheerio from "cheerio"
import configs from './configs'
import {mockData1, mockData2, mockData3} from './mockData'

const SLACK_HOOK_URL = configs.slack_hook
const WEBSITE_URL = configs.website_url

let prevAptCount: number = 0

const checkForApts = () => {
    fetch(WEBSITE_URL)
    .then(res => res.text())
    .then(data => {
        const site = cheerio.load(data)
        const aptCount = getAptsFromHTML(site)
        if(aptCount !== undefined) {
            if( aptCount > 0 &&
                aptCount !== prevAptCount  
            ) {
                sendAptAlert(aptCount)
            }
            prevAptCount = aptCount
        } else {
            prevAptCount = 0
        }
    })
}

const testForApts = (data: string) => {
    const site = cheerio.load(data)
    const aptCount = getAptsFromHTML(site)
    if(aptCount !== undefined) {
        if( aptCount > 0 &&
            aptCount !== prevAptCount  
        ) {
            sendAptAlert(aptCount)
        }
        prevAptCount = aptCount
    } else {
        prevAptCount = 0
    }

}

export const getAptsFromHTML = (site: CheerioStatic) => {
    let count
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
                count = parseInt(val.children[1].children[0].data)
            })
        }
    })
    return count
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

function main() {
    sendMessage("Hurray! I am on a watch B)")
    setInterval(checkForApts, 1000)
}

function test() {
    let counter = 0
    const interval = setInterval(() => {
        let data = mockData1
        if(counter == 0) 
            data = mockData1
        else if(counter == 1)
            data = mockData2
        else if(counter == 2)
            data = mockData3
        else if(counter == 3)
            data = mockData2
        else if(counter == 4)
            data = mockData1
        else if(counter == 5)
            data = mockData2
        else
            clearInterval(interval)

        testForApts(data)
        counter++
    }, 1000)
}

main()