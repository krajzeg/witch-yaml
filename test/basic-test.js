var assert = require('chai').assert;

describe("extractYamlProperties", function() {
	var extractYamlProperties = require('../').extractYamlProperties;
	var parse = extractYamlProperties();

	describe("for files without YAML frontmatter", function() {
		var sourceFile = {path: "file.txt", contents: "Hello!"};

		it("should return them unchanged", function() {
			var resultFile = parse(sourceFile);
			assert.equal(resultFile, sourceFile);
		});
	});

	describe("for files with YAML frontmatter", function() {
		var contents = '---\nspecies: wombat\nnumberOfLegs: 4\n---\nHello!'
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

	describe("with a different regular expression provided", function() {
		it("should still work", function() {
			var parse = extractYamlProperties({regex: /\[(.*?)\]/g});
			var contents = "[species: eagle]Hello![wingspan: huge]";
			var sourceFile = {path: "file.txt", contents: contents};

			var resultFile = parse(sourceFile);
			assert.equal(resultFile.contents, "Hello!");
			assert.equal(resultFile.species, "eagle");
			assert.equal(resultFile.wingspan, "huge");
		});
	});
});
