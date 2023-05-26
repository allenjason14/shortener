
import express from 'express'
import bodyParser from 'body-parser'
import { nanoid } from 'nanoid';

const app = express()
const port = 3000

const shortenedUrls = [];
const getIsUrlEncoded = (paramUrl, urlType) => {
    const chosenUrl = shortenedUrls.find(u => u[urlType] === paramUrl)
    return chosenUrl
}

  const isValidURL = (str) => {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
      '((\\d{1,3}\\.){3}\\d{1,3}))'+
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
      '(\\?[;&a-z\\d%_.~+=-]*)?'+
      '(\\#[-a-z\\d_]*)?$','i');
    return !!pattern.test(str);
  }

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/:url', (req, res) => {
    const paramUrl = req?.params.url;
    const encodedUrl = getIsUrlEncoded(paramUrl, "shortenedUrl")
    if (encodedUrl) {
        return res.redirect(encodedUrl.longUrl) 
    } else {
        res.send('Short URL not found.')
    }    
})

app.post('/shorten', (req, res) => {
    try {
        const paramUrl = req?.body.url;
        const isUrlEncoded = getIsUrlEncoded(paramUrl, "longUrl")
        const isValid = isValidURL(paramUrl)
        if (!isUrlEncoded && isValid) {
            const shortenedUrlId = `${nanoid(8)}`
            shortenedUrls.push({ shortenedUrl: shortenedUrlId, longUrl: paramUrl })
            res.send({ shortUrl: `https://www.localhost:3000/${shortenedUrlId}` });
        } else if (!isUrlEncoded && !isValid) {
            res.send('This URL has already been encoded');
        }  else {
            res.send('This URL has already been encoded');
        }
    } catch(err) {
        console.log('err', { err })
    }
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})