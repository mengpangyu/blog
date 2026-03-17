function main() {
  for (let i = 1; i <= 9; i++) {
    const n = Math.pow(10, i)
    const start = Date.now()
    let sum = 0
    for (let j = 1; j <= n; j++) {
      sum += j
    }
    const end = Date.now()
    const durationSec = ((end - start) / 1000).toFixed(3)
    console.log(`10^${i} 的数据规模, 总和为 ${sum}, 执行时间为 ${durationSec}秒`)
  }
}

main()
