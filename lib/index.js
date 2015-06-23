var jsYaml = require('js-yaml');

module.exports = {
	parseYAMLMetadata: parseYAMLMetadata
}

var YAML_DOC_SEPARATOR = "\n===\n";

function parseYAMLMetadata() {
	return function(file) {
		var contents = file.contents;
		if (file.contents.indexOf(YAML_DOC_SEPARATOR) >= 0) {
			// split into YAML and doc part
			var parts = file.contents.split(YAML_DOC_SEPARATOR, 1);
			var yamlString = parts[0], restOfContents = parts[1];

			// parse the YAML
			var yamlProps = jsYaml.safeLoad(yamlString, {
				filename: file.fullPath()				
			});

			// return a new file
			var changedProps = yamlProps;
			changedProps.contents = restOfContents;
			return file.update(changedProps);
		} else {
			// return an unchanged file
			return file;
		}
	}
}
