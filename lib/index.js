var _ = require('lodash');
var jsYaml = require('js-yaml');

module.exports = {
	parseYAMLMetadata: parseYAMLMetadata
}

var YAML_DOC_SEPARATOR = "\n===\n";

function parseYAMLMetadata() {
	return function(file) {
		var contents = file.contents;

		// do we have a YAML part?
		if (file.contents.indexOf(YAML_DOC_SEPARATOR) >= 0) {
			// split it off
			var parts = file.contents.split(YAML_DOC_SEPARATOR, 2);
			var yamlString = parts[0], restOfContents = parts[1];

			// parse the YAML
			var yamlProps = jsYaml.safeLoad(yamlString, {
				filename: file.path		
			});

			// return a new version of the file with the YAML truncated and
			// the properties specified in it set on the object
			return _.extend(file, yamlProps, {contents: restOfContents});
		} else {
			// no YAML, return an unchanged file
			return file;
		}
	}
}
