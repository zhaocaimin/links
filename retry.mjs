#!/usr/bin/env node
/// <reference types="zx" />
import { isNumber } from 'lodash-es';
import { $, argv, echo, question } from 'zx';
import { retry } from 'zx/experimental';

const formatSleep = (t) => {
    return isNumber(t) || /^\d.*m?s$/.test(String(t)) ? t : 10
}

const formatTries = (t) => {
    return Number(t) > 0 ? t : 10
}

(async () => {
    if (argv.help) {
        echo(`
    -h  --help  帮助
    -t  --tries=10 设置最大重试次数: 默认10
    -s  --sleep    默认单位毫秒秒 支持 10 , 10ms , 10s
    案例：
    retry -t=5 -s=300ms "curl https://github.com" # 请求GitHub最大重试五次 每次失败等待300ms
    `)
        return
    }
    let tries = argv.tries || argv.t;
    let sleep = argv.sleep || argv.s;
    let cmd = argv._[0];
    console.log(argv)
    if (!cmd) {
        cmd = await question('输入你需要执行重试的命令: ');
        tries = await question('重试次数: ', { choices: '10' });
        sleep = await question('等待时间(默认单位ms): ', { choices: '10ms' });
    }
    await retry(formatTries(tries), formatSleep(sleep), () => $`${cmd?.split(/\s+/)}`);
})().catch(echo);

