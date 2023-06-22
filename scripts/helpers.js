window.getNodeFromString = (str) => {
	return document.createRange().createContextualFragment(str).firstElementChild
}

window.getInstanceFromString = (constructor, str, ...args) => {
	return new constructor(window.getNodeFromString(str), ...args)
}

window.compose = (...methods) => (value) => methods.reduce((acc, method) => method(acc), value)
