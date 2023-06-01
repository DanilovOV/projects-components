export default class CustomSelect extends HTMLElement {

    constructor() {
        super()
        const shadow = this.attachShadow({mode: 'open'})
        shadow.append(document.querySelector('#custom-select').content.cloneNode(true))

        this.initFormDataInput()
        this._label = shadow.querySelector('.cs-view')
        this._list = shadow.querySelector('.cs-list')
        this._optionsArr = [...this.querySelectorAll('option')]
        this._prevValue = this._optionsArr[0]?.value || ''

        this.setValue(this.value)
        this.name = this.name
        this.disabled = this.disabled

        this._closeListMethod = this.closeList.bind(this)
        this.addListeners()
    }

    initFormDataInput() {
        this.insertAdjacentHTML('afterbegin', '<input>')
        this._input = this.querySelector('input')
    }

    addListeners() {
        this._label.addEventListener('click', this.setListState.bind(this))
        this._optionsArr.forEach(
            option => option.addEventListener('click', this.setChoise.bind(this)))
    }

    get name() {
        return this.getAttribute('name')
    }

    set name(value) {
        this.setAttribute('name', value || '')
        this._input.name = value || ''
    }

    get value() {
        return this.getAttribute('value')
    }

    set value(value) {
        this.setValue(value)
        this.dispatchEvent(new Event('change', {bubbles: true}))
    }

    get disabled() {
        return this.hasAttribute('disabled')
    }

    set disabled(value) {
        if (value) {
            this.setAttribute('disabled', '')
            this._label.classList.add('cs-disabled')
        } else {
            this.removeAttribute('disabled')
            this._label.classList.remove('cs-disabled')
        }
    }

    setValue(value) {
        const validValue = this.isValidValue(value) ? value : this._prevValue

        this.setAttribute('value', validValue)
        this._label.textContent = this.getOption(validValue)?.textContent
        this._prevValue = this._input.value = validValue
    }

    isValidValue(value) {
        return this.getOption(value) ? true : false
    }

    getOption(value) {
        return this.querySelector(`option[value="${value}"]`)
    }

    setChoise(e) {
        this.value = e.target.value 
    }

    setListState(e) {
        if (this.disabled) return

        e.stopPropagation()
        this._list.classList.contains('cs-list--active') ? this.closeList() : this.openList()
        document.addEventListener('click', this._closeListMethod)
    }

    openList() {
        this._list.classList.add('cs-list--active')
    }

    closeList() {
        this._list.classList.remove('cs-list--active')
        document.removeEventListener('click', this._closeListMethod)
    }
}