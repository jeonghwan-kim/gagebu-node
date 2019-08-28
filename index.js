const app = require('./src')
const port = 3000

app.listen(port, () => {
  console.log(`server is running ${port}`)
})