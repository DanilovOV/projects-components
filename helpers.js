window.getNodeFromString = (str) => {
	return document.createRange().createContextualFragment(str).firstElementChild
}
