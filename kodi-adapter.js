/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const fetch = require('node-fetch');

const {
  Adapter,
  Device,
} = require('gateway-addon');

class KodiDevice extends Device {
  constructor(adapter, manifest) {
    super(adapter, manifest.display_name);
    this['@context'] = 'https://iot.mozilla.org/schemas/';
    this.name = manifest.display_name;
    this.description = manifest.description;
    this.callbacks = {};

    const show = async (title, message, displaytime) => {
      console.log(`Sending message: ${title}/${message}`);
      const address = manifest.moziot.config.address;

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
    };

    this.addCallbackAction({
      title: 'show',
      description: 'Show a notification',
      input: {
        type: 'object',
        properties: {
          title: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          displaytime: {
            type: 'integer'
          }
        }
      }
    }, (action) => {
      show(action.input.title, action.input.message, action.input.displaytime);
    });

    if (manifest.moziot.config.messages) {
      for (const messageInfo of manifest.moziot.config.messages) {
        const {
          name,
          title,
          message,
          displaytime
        } = messageInfo;

        console.log(`Creating action for ${name}`);

        this.addCallbackAction({
          title: name,
          description: 'Show a notification'
        }, () => {
          show(title, message, displaytime);
        });
      }
    }
  }

  addCallbackAction(description, callback) {
    this.addAction(description.title, description);
    this.callbacks[description.title] = callback;
  }

  async performAction(action) {
    action.start();

    const callback = this.callbacks[action.name];

    if (callback) {
      callback(action);
    } else {
      console.warn(`Unknown action ${action.name}`);
    }

    action.finish();
  }
}

class KodiAdapter extends Adapter {
  constructor(addonManager, manifest) {
    super(addonManager, KodiAdapter.name, manifest.name);
    addonManager.addAdapter(this);
    const kodi = new KodiDevice(this, manifest);
    this.handleDeviceAdded(kodi);
  }
}

module.exports = KodiAdapter;
