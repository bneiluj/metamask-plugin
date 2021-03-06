const assert = require('assert')
const additions = require('react-testutils-additions')
const h = require('react-hyperscript')
const PendingTx = require('../../../ui/app/components/pending-tx')
const ReactTestUtils = require('react-addons-test-utils')
const ethUtil = require('ethereumjs-util')

describe('PendingTx', function () {
  const identities = {
    '0xfdea65c8e26263f6d9a1b5de9555d2931a33b826': {
      name: 'Main Account 1',
      balance: '0x00000000000000056bc75e2d63100000',
    },
  }

  const gasPrice = '0x4A817C800' // 20 Gwei
  const txData = {
    'id':5021615666270214,
    'time':1494458763011,
    'status':'unapproved',
    'metamaskNetworkId':'1494442339676',
    'txParams':{
      'from':'0xfdea65c8e26263f6d9a1b5de9555d2931a33b826',
      'to':'0xc5b8dbac4c1d3f152cdeb400e2313f309c410acb',
      'value':'0xde0b6b3a7640000',
      gasPrice,
      'gas':'0x7b0c'},
    'gasLimitSpecified':false,
    'estimatedGas':'0x5208',
  }


  it('should use updated values when edited.', function (done) {

    const renderer = ReactTestUtils.createRenderer()
    const newGasPrice = '0x77359400'

    const props = {
      identities,
      accounts: identities,
      txData,
      sendTransaction: (txMeta, event) => {

        // Assert changes:
        const result = ethUtil.addHexPrefix(txMeta.txParams.gasPrice)
        assert.notEqual(result, gasPrice, 'gas price should change')
        assert.equal(result, newGasPrice, 'gas price assigned.')
        done()
      },
    }

    const pendingTxComponent = h(PendingTx, props)
    const component = additions.renderIntoDocument(pendingTxComponent)
    renderer.render(pendingTxComponent)
    const result = renderer.getRenderOutput()
    assert.equal(result.type, 'div', 'should create a div')

    try {
      const input = additions.find(component, '.cell.row input[type="number"]')[1]
      ReactTestUtils.Simulate.change(input, {
        target: {
          value: 2,
          checkValidity() { return true },
        },
      })

      const form = additions.find(component, 'form')[0]
      form.checkValidity = () => true
      form.getFormEl = () => { return { checkValidity() { return true } } }
      ReactTestUtils.Simulate.submit(form, { preventDefault() {}, target: { checkValidity() {
        return true
      } } })

    } catch (e) {
      console.log('WHAAAA')
      console.error(e)
    }
  })
})

