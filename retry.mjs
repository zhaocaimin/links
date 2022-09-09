#!/usr/bin/env node
/// <reference types="zx" />
import { $, argv, echo, question } from 'zx';
import { retry } from 'zx/experimental'
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
    let tries = argv.tries || argv.t || 10;
    let sleep = argv.sleep || argv.s || 10;
    let cmd = argv._[1];

    if (!cmd) {
        cmd = await question('输入你需要执行重试的命令: ');
        tries = await question('重试次数: ') || 10;
        sleep = await question('等待时间(默认单位ms): ') || 10;
    }
    await retry(tries, sleep, () => $`${cmd?.split(/\s+/)}`);
})().catch(echo);