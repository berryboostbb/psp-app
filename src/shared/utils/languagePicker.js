const languages = require("./language.json");

export const languagePicker = (lang, key) => {
	let response = "";
	// key = key.toUpperCase();
	leng = lang?.toUpperCase();
	if (key in languages) {
		if (lang?.toUpperCase() === "ENG") {
			response = languages[key]?.ENG;
		} else if (lang?.toUpperCase() === "FR") {
			response = languages[key]?.FR;
		} else {
			response = languages[key]?.ENG;
			//response = "please use only ENG | FR as a first argument";
		}
	} else {
		response = "key not found";
	}
	return response;
};

// console.log(languagePicker("fr", "NONE_DEBIT_CASHBACK"));

// module.exports = languagePicker;
