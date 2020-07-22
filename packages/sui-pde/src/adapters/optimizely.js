const optimizelySDK = require('@optimizely/optimizely-sdk')

const DEFAULT_OPTIONS = {
  autoUpdate: true,
  updateInterval: 10 * 1000 // 10 seconds in milliseconds
}

const DEFAULT_TIMEOUT = 500

export default class OptimizelyAdapter {
  constructor({optimizely, userId}) {
    if (this._userId) {
      throw new Error('userId is mandatory to use OptimizelyAdapter')
    }

    if (this._optimizely) {
      throw new Error(
        'optimizely instance is mandatory to use OptimizelyAdapter'
      )
    }

    this._optimizely = optimizely
    this._userId = userId.toString()
  }

  static createOptimizelyInstance({options = DEFAULT_OPTIONS, sdkKey}) {
    optimizelySDK.setLogLevel('info')
    optimizelySDK.setLogger(optimizelySDK.logging.createLogger())

    return optimizelySDK.createInstance({
      sdkKey,
      datafileOptions: options
    })
  }

  getEnabledFeatures({attributes} = {}) {
    return this._optimizely.getEnabledFeatures(this._userId, attributes)
  }

  /**
   * Activates an A/B test for the specified user to start an experiment: determines whether they qualify for the experiment, buckets a qualified user into a variation, and sends an impression event to Optimizely.
   * More info: https://docs.developers.optimizely.com/full-stack/docs/activate-javascript-node
   * @param {Object} params
   * @param {string} params.name
   * @returns {string} variation name
   */
  activateExperiment({name}) {
    return this._optimizely.activate(name, this._userId)
  }

  /**
   * Tracks a conversion event. Logs an error message if the specified event key doesn't match any existing events.
   * More info: https://docs.developers.optimizely.com/full-stack/docs/track-javascript-node
   * @param {Object} params
   * @param {string} params.name
   */
  trackExperiment({name}) {
    return this._optimizely.track(name, this._userId)
  }

  onReady() {
    return this._optimizely
      .onReady({timeout: DEFAULT_TIMEOUT})
      .then(() => this._optimizely)
  }
}
