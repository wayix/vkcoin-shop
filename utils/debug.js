const { cpuTemperature } = require('systeminformation');
const { freemem, totalmem, platform, loadavg, arch, release } = require('os');
const { memoryUsage, pid, version, versions, resourceUsage, cpuUsage } = require('process');

const { formate } = require('./functions.js');

let latestUsage = cpuUsage()
let latestTime = new Date().getTime()
let percentCpu = 0


setInterval(() => {
    const currentUsage = cpuUsage()
    const currentTime = new Date().getTime()

    const cpuTime = (currentUsage.system - latestUsage.system) + (currentUsage.user - latestUsage.user)

    percentCpu = 100 * cpuTime / ((currentTime - latestTime) * 1000) 

    latestUsage = currentUsage
    latestTime = currentTime
}, 3e3)

async function debug() {
    const freeMem = freemem()
    const botMemory = memoryUsage()
    const totalMem = totalmem()

    const [cpuTemp, resUsage] = await Promise.all([
        cpuTemperature(),
        resourceUsage()
    ])

    return [
        '-- Система --',
        `Температура ЦП: ${cpuTemp.main != null ? `${cpuTemp.main} °C`: 'Н/Д'}`,
        `Занято ОЗУ: ${formate.bytes(totalMem - freeMem)}/${formate.bytes(totalMem)}`,
        `Средняя нагрузка ЦП: ${loadavg().join(' ')}`,
        `ОС: ${platform()} (${release()}) (${arch()})`,

        `\n-- Бот --`,
        `PID: ${pid}`,
        `Использование ЦП: ${percentCpu.toFixed(2)}%`,
        `┌ Занято ОЗУ: ${formate.bytes(botMemory.rss)}/${formate.bytes(resUsage.maxRSS * 1024)}`,
        `├── V8: ${formate.bytes(botMemory.external)}`,
        `├── C++: ${formate.bytes(botMemory.heapUsed)}/${formate.bytes(botMemory.heapTotal)}`,
        `└── Buffers: ${formate.bytes(botMemory.arrayBuffers)}`,

        `┌ Версия NodeJS: ${version}`,
        `├── C++ API: ${versions.modules}`,
        `├── Node API: ${versions.napi}`,
        `└── V8: ${versions.v8}`,
        `┌ Диск`,
        `├── Чтений: ${resUsage.fsRead}`,
        `└── Записей: ${resUsage.fsWrite}`
    ].join('\n')
}

module.exports = debug;