'use strict'

const reekoh = require('reekoh')
const domain = require('domain')
const _plugin = new reekoh.plugins.Logger()

let loggentriesLogger = null
let level = null

_plugin.on('log', (logData) => {
  let d = domain.create()

  d.once('error', (error) => {
    console.log(error)
    loggentriesLogger.log(level, logData)
    d.exit()
  })

  d.run(() => {
    let logLevel = level

    if (logData.level) {
      logLevel = logData.level
      delete logData.level
    }

    loggentriesLogger.log(logLevel, logData, (error) => {
      if (error) {
        console.error('Error on Loggentries.', error)
        _plugin.logException(error)
      }
      _plugin.log(JSON.stringify({
        title: 'Log sent to Loggentries',
        data: logData
      }))
    })
    d.exit()
  })
})

_plugin.once('ready', () => {
  const Logger = require('le_node')

  level = _plugin.config.logLevel || 'info'

  loggentriesLogger = new Logger({
    token: _plugin.config.token
  })

  loggentriesLogger.on('error', (error) => {
    console.error('Error on Logentries.', error)
    _plugin.logException(error)
  })

  _plugin.log('Logentries has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
