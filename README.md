# Airlst Development

*Generated with [ng-poly](https://github.com/dustinspecker/generator-ng-poly/tree/v0.10.14) version 0.10.14*

## Setup
1. Install [Node.js](http://nodejs.org/)
 - This will also install npm.
2. Run `npm install` to install this project's dependencies
3. Create an enviroment file `env.json` (use `env-example.json` as a sample). If you run `npm run server`, make sure to set `api` in `env.json` to `http://localhost:8080`.
4. Run `npm run server` to start development server
5. Open `http://localhost:8080` in browser to view the page

#Development
1. Use [generator-ng-poly](https://github.com/dustinspecker/generator-ng-poly) to create additional components

## NPM scripts
- Run `npm run server` to run development server
- Run `npm run build` to build production

## Setting up Workflows

1. In console run ``php artisan tinker``

2. Paste the follow
``
$c = \Airlst\Data\Models\Company::find(3);
$c->workflows = ['sample-global-action', 'sample-row-action', 'sample-with-selected-action', 'sample-dropdown-action', 'sample-archive-with-selected-action', 'change-status-and-send-email', 'i-dont-exist'];
$c->save();
``

	* You should be able to see:
	* Sample Global - before add new
	* Sample Row - after details
	* Sample Dropdown - under add new
	* Sample With Selected - on selection
	* Confirm User - on selection
	* Sample With Archived - show archived -> on selection