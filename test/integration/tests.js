import test from 'blue-tape'
import contentTypeTests from './content-type'
import entryTests from './entry'
import assetTests from './asset'
import contentfulManagement from '../../'

const params = {
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
}

if (process.env.API_INTEGRATION_TESTS) {
  params.host = '127.0.0.1:5000'
  params.insecure = true
}

const client = contentfulManagement.createClient(params)

test('Gets space', (t) => {
  t.plan(2)
  return client.getSpace('cfexampleapi')
  .then((response) => {
    t.ok(response.sys, 'sys')
    t.ok(response.name, 'name')
  })
})

test('Fails to get space', (t) => {
  t.plan(2)
  return client.getSpace('weirdrandomid' + Math.ceil(Math.random() * 1e8))
  .then(() => {}, (error) => {
    t.equals(error.name, 'NotFound', 'error name')
    const errorData = JSON.parse(error.message)
    t.equals(errorData.status, 404, 'http status code from parsed error data')
  })
})

test('Gets space with entities', (t) => {
  return client.getSpace('cfexampleapi')
  .then((space) => {
    contentTypeTests(t, space)
    entryTests(t, space)
    assetTests(t, space)
  })
})
