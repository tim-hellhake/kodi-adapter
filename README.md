# Kodi Adapter

[![Build Status](https://travis-ci.org/tim-hellhake/kodi-adapter.svg?branch=master)](https://travis-ci.org/tim-hellhake/kodi-adapter)
[![dependencies](https://david-dm.org/tim-hellhake/kodi-adapter.svg)](https://david-dm.org/tim-hellhake/kodi-adapter)
[![devDependencies](https://david-dm.org/tim-hellhake/kodi-adapter/dev-status.svg)](https://david-dm.org/tim-hellhake/kodi-adapter?type=dev)
[![optionalDependencies](https://david-dm.org/tim-hellhake/kodi-adapter/optional-status.svg)](https://david-dm.org/tim-hellhake/kodi-adapter?type=optional)
[![license](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)

Show notifications on your media player.

## Configuration
1. Go to `settings`/`services` in your kodi instance
2. Activate `Control`/`Allow remote control via HTTP`
3. Add the address of your kodi instance to the config of the addon

## Usage
The addon registers a Kodi device with a `show(title, message)` action.

Currently, a rule can only trigger parameterless actions.

To send Kodi messages from a rule, you have to register an action with a predefined message.

Go to the settings of the addon and add an action with a name, a title and a message of your choice.

The Kodi device now provides a new action with the specified name you can use in a rule.
