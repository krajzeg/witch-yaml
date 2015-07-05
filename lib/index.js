var _ = require('lodash');
var jsYaml = require('js-yaml');

module.exports = {
	extractYamlProperties: extractYamlProperties
}

var FRONTMATTER_REGEX = /---([\s\S]*?)---\s*/g;

function extractYamlProperties(options) {
	options = options || {};
	var yamlRegex = options.regex || FRONTMATTER_REGEX;

	return function(file) {
		var contents = file.contents;

		// do we have a YAML part?
		if (yamlRegex.test(file.contents)) {		
			// remove it from contents and parse it at the same time
			var yamlProps = {};
			var newContents = file.contents.replace(yamlRegex, function(wholeMatch, yaml) {
				yamlProps = _.extend(yamlProps, jsYaml.safeLoad(yaml));
				return ""; // replace the whole front matter with empty string
			});

			// return a new version of the file with the YAML truncated and
			// the properties specified in it set on the object
			return _.extend(file, yamlProps, {contents: newContents});
		} else {
			// no YAML, return an unchanged file
			return file;
		}
	}
}
