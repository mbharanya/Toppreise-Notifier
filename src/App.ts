import * as WebRequest from 'web-request'
import * as fs from 'fs'
import * as PushBullet from 'pushbullet'
export default class App {
    async check() {
        const response = await WebRequest.post("https://www.toppreise.ch/chart_both.php", {
            headers:
            {
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Content-Type": "application/x-www-form-urlencoded"
            }
            , body: "prodID=500594&cs=5b2b6360"
        })

        const priceHistories: [PriceHistory[]] = JSON.parse(response.content)

        const priceHistory = priceHistories.map((h): PriceHistory => h.pop()).pop()

        const fileName = "status.txt";
        const newPrice = priceHistory[1];

        if (!fs.readFileSync(fileName) == newPrice) {
            // console.log("changed")
            fs.writeFileSync(fileName, newPrice)
            this.push(newPrice)
        } else {
            // console.log("still the same")
        }
    }

    push(msg: string) {
        let pusher = new PushBullet(process.argv[2])
        // console.log(process.argv[2])

        pusher.note(
            {},
            `LG TV price changed to ${msg}`
            ,
            function (error, response) {
                // console.log(response)
                if (error) throw error
            });

    }
}

const app = new App()
app.check()

// curl 'https://www.toppreise.ch/chart_both.php' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: application/json, text/javascript, */*; q=0.01' --data 'prodID=500594&cs=5b2b6360' --compressed

interface PriceHistory {
    timestamp: number,
    price: number
}