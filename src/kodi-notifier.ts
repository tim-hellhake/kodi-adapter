/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import { Notifier, Outlet } from "gateway-addon";

import fetch from 'node-fetch';

class KodiOutlet extends Outlet {
  constructor(notifier: Notifier, private config: any) {
    super(notifier, KodiOutlet.name);
    this.name = 'Kodi';
  }

  async notify(title: string, message: string) {
    await this.show(title, message, 3000);
  }

  async show(title: string, message: string, displaytime: number) {
    console.log(`Sending message: ${title}/${message}`);
    const address = this.config.address;

    if (address && address.trim && address.trim() !== '') {
      const params: (string | number)[] = [title, message];

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

export class KodiNotifier extends Notifier {
  constructor(addonManager: any, manifest: any) {
    super(addonManager, KodiNotifier.name, manifest.name);

    addonManager.addNotifier(this);

    if (!this.outlets[KodiOutlet.name]) {
      this.handleOutletAdded(
        new KodiOutlet(this, manifest.moziot.config)
      );
    }
  }
}
