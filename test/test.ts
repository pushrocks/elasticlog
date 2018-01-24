import { expect, tap } from 'tapbundle'
import { Qenv } from 'qenv'
import * as elasticlog from '../ts/index'

const testQenv = new Qenv('./', './.nogit/')

let testElasticLog: elasticlog.ElasticLog<any>

tap.test('first test', async () => {
  testElasticLog = new elasticlog.ElasticLog({
    domain: process.env.ELK_DOMAIN,
    port: parseInt(process.env.ELK_PORT, 10),
    ssl: true,
    user: process.env.ELK_USER,
    pass: process.env.ELK_PASS,
    logContext: {
      containerName: 'testContainer',
      environment: 'test'
    }
  })
  expect(testElasticLog).to.be.instanceOf(elasticlog.ElasticLog)
})

tap.test('should send a message to Elasticsearch', async () => {
  testElasticLog.log({
    severity: 'log',
    message: 'hi, this is a testMessage'
  })
})

tap.start()
