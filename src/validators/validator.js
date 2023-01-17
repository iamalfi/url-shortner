const validUrl = (url) => (/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%\+.~#?&\/=]*)$/).test(url);

const validUrlCode = (code) => (/^[a-zA-Z0-9_-]*$/).test(code);
module.exports = {validUrl, validUrlCode}