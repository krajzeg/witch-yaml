var assert = require('chai').assert;

describe("parseYAMLMetadata", function() {
	var parseYAMLMetadata = require('../').parseYAMLMetadata;
	var parse = parseYAMLMetadata();

	describe("for files without YAML metadata", function() {
		var sourceFile = {path: "file.txt", contents: "Hello!"};

		it("should return them unchanged", function() {
			var resultFile = parse(sourceFile);
			assert.equal(resultFile, sourceFile);
		});
	});

	describe("for files with YAML metadata", function() {
		var contents = 'species: wombat\nnumberOfLegs: 4\n===\nHello!'
		var sourceFile = {path: "file.txt", contents: contents};
		var resultFile = parse(sourceFile);

		it("should add the properties from YAML into the file", function() {
			assert.equal(resultFile.species, "wombat");
			assert.equal(resultFile.numberOfLegs, 4);
		});

		it("should strip the YAML from the contents", function() {
			assert.equal(resultFile.contents, "Hello!");
		});
	});
});
