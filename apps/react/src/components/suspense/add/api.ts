async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
export async function getMessage() {
  await delay(300)
  return { value: Math.floor(Math.random() * 10000) }
}
