import test from 'tape'
import sinon from 'sinon'
import createClient from '../../lib/contentful-management'

const axios = {create: sinon.stub()}

test.only('Throws if no accessToken is defined', (t) => {
  t.throws(() => {
    createClient(axios, {space: 'spaceid'})
  }, /Expected parameter accessToken/)
  t.end()
})

test('Passes along HTTP client parameters', (t) => {
  createClient.__Rewire__('version', 'version')
  const createHttpClientStub = sinon.stub()
  createClient.__Rewire__('createHttpClient', createHttpClientStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(createHttpClientStub.args[0][1].headers['Content-Type'])
  t.equals(createHttpClientStub.args[0][1].headers['X-Contentful-User-Agent'], 'contentful.js/version')
  createClient.__ResetDependency__('createHttpClient')
  t.end()
})

test('Returns a client instance', (t) => {
  const client = createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(client.getSpace, 'getSpace')
  t.ok(client.getEntry, 'getEntry')
  t.ok(client.getEntries, 'getEntries')
  t.ok(client.getContentType, 'getContentType')
  t.ok(client.getContentTypes, 'getContentTypes')
  t.ok(client.getAsset, 'getAsset')
  t.ok(client.getAssets, 'getAssets')
  t.end()
})

test('Initializes API with link resolution turned on by default', (t) => {
  const apiStub = sinon.stub().returns({})
  createClient.__Rewire__('createContentfulApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid'})
  t.ok(apiStub.args[0][0].shouldLinksResolve({}), 'not overriden by query')
  t.notOk(apiStub.args[0][0].shouldLinksResolve({resolveLinks: false}), 'overriden by query')
  t.end()
})

test('Initializes API with link resolution turned on explicitly', (t) => {
  const apiStub = sinon.stub().returns({})
  createClient.__Rewire__('createContentfulApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid', resolveLinks: true})
  t.ok(apiStub.args[0][0].shouldLinksResolve({}), 'not overriden by query')
  t.notOk(apiStub.args[0][0].shouldLinksResolve({resolveLinks: false}), 'overriden by query')
  t.end()
})

test('Initializes API with link resolution turned off explicitly', (t) => {
  const apiStub = sinon.stub().returns({})
  createClient.__Rewire__('createContentfulApi', apiStub)
  createClient(axios, {accessToken: 'accesstoken', space: 'spaceid', resolveLinks: false})
  t.notOk(apiStub.args[0][0].resolveLinksGlobalSetting)
  t.end()
})