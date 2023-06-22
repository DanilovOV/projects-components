export default class NodesLimitController {

    constructor({nodesList, nodesSelector, moreButton, hideClass = 'hidden', nodesLimit, increaseCount = nodesLimit}) {
        this.hideClass = hideClass
        this.increaseCount = increaseCount

        this.setNodesList(nodesList)
        this.setNodesSelector(nodesSelector)
        this.setMoreButton(moreButton)
        this.setNodesLimit(nodesLimit)
    }

    setNodesList(node) {
        this._nodesList = node
        this._setListChangesObserver()
    }

    _setListChangesObserver() {
        this.changeListNodesObserver?.disconnect()
        this.changeListNodesObserver = new MutationObserver(this._handleUpdatedList.bind(this))
        this.changeListNodesObserver.observe(this._nodesList, { childList: true })
    }

    setNodesSelector(selector) {
        this._setNodesArr = () => this._nodesArr = [...this._nodesList.querySelectorAll(selector)]
        this._setNodesArr()
    }

    setMoreButton(node) {
        this._moreButton = node
        this._moreButton?.addEventListener('click', this.showMoreNodes.bind(this))
    }

    setNodesLimit(num) {
        this._nodesLimit = num
        this._setVisibility()
    }

    showMoreNodes() {
        this.setNodesLimit(this._nodesLimit + this.increaseCount)
    }

    _handleUpdatedList() {
        this._setNodesArr()
        this._setVisibility()
    }

    _setVisibility() {
        this._setNodesVisibility()
        this._setButtonVisibility()
    }

    _setNodesVisibility() {
        this._nodesArr
            .forEach(node => node.classList.remove('hidden'))

        this._nodesArr
            .filter((_, index) => index >= this._nodesLimit)
            .forEach(node => node.classList.add('hidden'))
    }

    _setButtonVisibility() {
        this._nodesArr.length <= this._nodesLimit
            ? this._moreButton.classList.add('hidden')
            : this._moreButton.classList.remove('hidden')
    }
}
