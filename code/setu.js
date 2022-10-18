const { default: axios } = require('axios');
const cheerio = require('cheerio');

//用来生成色图url
//src:图片地址;alt:图片标题
module.exports = (app) => {
    let l = [];
    axios.get('https://asiantolick.com/').then(res => {
        const $ = cheerio.load(res.data);
        $('.miniaturaImg').each((i, e) => {
            const src = $(e).attr('src');
            const alt = $(e).attr('alt');
            l.push({ src, alt });
        });
        // console.log(l)
        return l;
    });
}



