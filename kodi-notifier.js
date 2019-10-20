/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const fetch = require('node-fetch');

const {
  Notifier,
  Outlet,
} = require('gateway-addon');

class KodiOutlet extends Outlet {
  constructor(notifier, config) {
    super(notifier, KodiOutlet.name);
    this.name = 'Kodi';
    this.config = config;
  }

  async notify(title, message) {
    await this.show(title, message, 3000);
  }

  async show(title, message, displaytime) {
    console.log(`Sending message: ${title}/${message}`);
    const address = this.config.address;

    if (address && address.trim && address.trim() !== '') {
      const params = [title, message];

      if (displaytime) {
        params.push('');
        params.push(Math.max(1500, Math.min(5000, displaytime)));
      }

      await fetch(`http://${address}:8080/jsonrpc`, {
        method: 'post',
        body: JSON.stringify(
          [{
            jsonrpc: '2.0',
            method: 'GUI.ShowNotification',
            params,
            id: 0
          }]
        ),
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } else {
      console.warn('Address not set');
    }
  }
}

class KodiNotifier extends Notifier {
  constructor(addonManager, manifest) {
    super(addonManager, KodiNotifier.name, manifest.name);

    addonManager.addNotifier(this);

    if (!this.outlets[KodiOutlet.name]) {
      this.handleOutletAdded(
        new KodiOutlet(this, manifest.moziot.config)
      );
    }
  }
}

module.exports = KodiNotifier;
