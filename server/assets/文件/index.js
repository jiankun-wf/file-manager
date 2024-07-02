import { load } from "cheerio";
import fetch from "node-fetch";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const baseDomain = 'https://www.fontstar.com.cn';

const apiUrl = 'https://www.fontstar.com.cn/api/webapi/getShowWorksList';

const getRewardMenus = async () => {
    const url = `${baseDomain}/showFont`

    const res = await fetch(url);
    const text = await res.text();

    const $ = load(text);

    const menusEl = $('.work_titles .work_title');

    const menuList = []
    $(menusEl).each((index, el) => {
        const href = $(el).find('a.myFont').attr('href');
        const title = $(el).find('a.myFont > span').text();
        menuList.push({
            title,
            href: `${baseDomain}${href}`
        })
    })
    return menuList;
}



export const start = async () => {

    const menus = await getRewardMenus();


    for (const menu of menus) {

        menu.rewards = []

        const { href } = menu;

        const url = new URL(href);
        const competition = url.searchParams.get('competition');

        const res = await fetch(`${apiUrl}?competition=${competition}`);
        const { data } = await res.json();

        for (const item of data) {
            menu.rewards.push(item);
        }

    }

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    fs.writeFileSync(resolve(__dirname, 'index.json'), JSON.stringify(menus, null, 2))

}

start();