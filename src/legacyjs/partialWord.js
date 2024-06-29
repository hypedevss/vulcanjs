module.exports = (word, search) => {
	const lowerCaseWord = word.toLowerCase();
	const lowerCaseSearch = search.toLowerCase();

	if (lowerCaseWord.includes(lowerCaseSearch)) {
	  return word;
	}
	else {
	  return null;
	}
};
