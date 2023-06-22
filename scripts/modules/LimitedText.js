export default class LimitedText {
    
    constructor(wrapper) {
        this.wrapper = wrapper
        this.isTextOpen = false

        this.init()
    }

    init() {
        this.wrapChildNodes()
        if (!this.isWrapperOverflowed()) return

        const overflowNodes = this.getOverflowNodes()
        this.hideNodesArr(overflowNodes.nodesForHide)
        this.reduceNode(overflowNodes.nodeForReduce)
        this.addControlButton(overflowNodes.nodeForReduce)
    }

    wrapChildNodes() {
        this.childNodesWrapper = document.createElement('div')
        this.childNodesWrapper.innerHTML = this.wrapper.innerHTML

        this.wrapper.innerHTML = ''
        this.wrapper.append(this.childNodesWrapper)
    }

    isWrapperOverflowed() {
        return this.wrapper.offsetHeight < this.childNodesWrapper.offsetHeight
    }

    hideNodesArr(nodesArr) {
        if (!nodesArr.length) return

        this.wrapperForHide = document.createElement('div')
        nodesArr[0].before(this.wrapperForHide)
        this.wrapperForHide.append(...nodesArr)
        this.wrapperForHide.style.display = 'none'
    }

    reduceNode(node) {
        const nodeText = node.textContent
        this.hiddenText = getTextForHide(nodeText, ['.', '!', '?']) || getTextForHide(nodeText, [' '])

        function getTextForHide(text, separatorsArr) {
            for (let i = text.length - 1; i > 0; i--) {
                if (separatorsArr.some(separator => separator === text[i])) {
                    node.textContent = text.slice(0, i + 1)
                    
                    if (!this.isWrapperOverflowed() && !isOverflowedWithButton.call(this, node)) {
                        return text.slice(i + 1, text.length)
                    }
                }
            }
        }

        function isOverflowedWithButton(node) {
            let result = false
            this.addControlButton(node)
            if (this.isWrapperOverflowed())
                result = true
            
            node.removeChild(this.controlButton)
            return result
        }

        const hiddenTextNode = document.createElement('span')
        hiddenTextNode.innerHTML = this.hiddenText.slice(0, -1)
        this.hiddenText = hiddenTextNode
    }

    addControlButton(node) {
        this.controlButton = document.createElement('span')
        this.controlButton.innerText = 'Подробнее'
        this.controlButton.addEventListener('click', this.toggleText.bind(this))

        this.controlButton.style.cssText = `
            margin-left: 5px;
            border-bottom: 1px solid currentColor;
            color: #245583;
            cursor: pointer;
        `

        node.append(this.controlButton)
    }



    toggleText() {
        this.isTextOpen = !this.isTextOpen
        this.isTextOpen
            ? this.openText()
            : this.closeText()
    }

    openText() {
        if (this.wrapperForHide) this.wrapperForHide.style.display = 'block'
        this.controlButton.before(this.hiddenText)
        this.controlButton.innerText = 'Свернуть'
        this.wrapper.style.maxHeight = this.wrapper.style.height = 'unset'
    }

    closeText() {
        if (this.wrapperForHide) this.wrapperForHide.style.display = 'none'
        this.controlButton.parentElement.removeChild(this.hiddenText)
        this.controlButton.innerText = 'Подробнее'
        this.wrapper.style.maxHeight = this.wrapper.style.height = this.childNodesWrapper.offsetHeight + 'px'
    }



    getOverflowNodes() {
        let wrapperHeight = this.wrapper.offsetHeight
        const overflowNodes = {
            nodeForReduce: null,
            nodesForHide: [],
        }
        
        for (let i = 0; i < this.childNodesWrapper.childNodes.length; i++) {
            const node = this.getElementNode(this.childNodesWrapper.childNodes[i])
            
            wrapperHeight -= node.offsetHeight

            if (wrapperHeight < 0) {
                if (overflowNodes.nodeForReduce)
                    overflowNodes.nodesForHide.push(node)
                else {
                    overflowNodes.nodeForReduce = isNodeBadForReduce(node)
                        ? this.getElementNode(this.childNodesWrapper.childNodes[i - 1])
                        : overflowNodes.nodeForReduce = node
                }

            }
        }

        function isNodeBadForReduce(node) {
            return (node.offsetHeight - Math.abs(wrapperHeight)) < window.getComputedStyle(node).getPropertyValue('line-height')
        }

        return overflowNodes
    }

    getElementNode(node) {
        return (!node.offsetHeight && node.offsetHeight != 0) 
            ? this.getWrappedNode(node, 'span')
            : node
    }

    getWrappedNode(node, wrapperTagName) {
        const wrapper = document.createElement(wrapperTagName)
        node.replaceWith(wrapper)
        wrapper.append(node)

        return wrapper
    }
}