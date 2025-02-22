const { UIPlugin } = require('@uppy/core')
const { Provider } = require('@uppy/companion-client')
const { h } = require('preact')
const DriveProviderViews = require('./DriveProviderViews')

module.exports = class GoogleDrive extends UIPlugin {
  static VERSION = require('../package.json').version

  constructor (uppy, opts) {
    super(uppy, opts)
    this.id = this.opts.id || 'GoogleDrive'
    this.title = this.opts.title || 'Google Drive'
    Provider.initPlugin(this, opts)
    this.title = this.opts.title || 'Google Drive'
    this.icon = () => (
      <svg
        aria-hidden="true"
        focusable="false"
        width="32"
        height="32"
        viewBox="0 0 32 32"
      >
        <g fill="none" fillRule="evenodd">
          <rect
            className="uppy-ProviderIconBg"
            fill="#4285F4"
            width="32"
            height="32"
            rx="16"
          />
          <path
            d="M25.216 17.736L19.043 7h-6.086l6.175 10.736h6.084zm-11.275.896L10.9 24h11.723l3.04-5.368H13.942zm-1.789-10.29l-5.816 10.29L9.38 24l5.905-10.29-3.132-5.369z"
            fill="#FFF"
          />
        </g>
      </svg>
    )

    this.provider = new Provider(uppy, {
      companionUrl: this.opts.companionUrl,
      companionHeaders: this.opts.companionHeaders,
      companionKeysParams: this.opts.companionKeysParams,
      companionCookiesRule: this.opts.companionCookiesRule,
      provider: 'drive',
      pluginId: this.id,
    })

    this.defaultLocale = {
      strings: {
        pluginNameGoogleDrive: 'Google Drive',
      },
    }
    this.i18nInit()
    this.title = this.i18n('pluginNameGoogleDrive')

    this.onFirstRender = this.onFirstRender.bind(this)
    this.render = this.render.bind(this)
  }

  install () {
    this.view = new DriveProviderViews(this, {
      provider: this.provider,
    })

    const { target } = this.opts
    if (target) {
      this.mount(target, this)
    }
  }

  uninstall () {
    this.view.tearDown()
    this.unmount()
  }

  onFirstRender () {
    return Promise.all([
      this.provider.fetchPreAuthToken(),
      this.view.getFolder('root', '/'),
    ])
  }

  render (state) {
    return this.view.render(state)
  }
}
