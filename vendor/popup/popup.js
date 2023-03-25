/*!
 * Prompt Editor (https://github.com/dev2bit/prompt-editor)
 * dev2bit (developers@dev2bit.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

class Popup {

    constructor(attrs) {
        this.title = attrs.title || '';
        this.content = attrs.content || '';
        this.buttons = attrs.buttons || [];
        this.classes = attrs.classes || [];
        this.resolve = attrs.resolve || null;
        this.load = attrs.load || null;
    }

    createPopup(resolve, reject) {
        if (this.resolve){
            this.resolve.resolve = resolve;
            this.resolve.reject = reject;
        }
        let popup = document.createElement('div');
        popup.id = 'popup';
        popup.className = 'popup';
        for (let className of this.classes) {
            popup.classList.add(className);
        }
        popup.appendChild(this.createPopupTitle());
        popup.appendChild(this.createPopupContent());
        popup.appendChild(this.createPopupButtons(resolve, reject));
        return popup;
    }

    createPopupTitle() {
        let title = document.createElement('div');
        title.className = 'popup-title';
        title.innerText = this.title;
        return title;
    }

    createPopupContent(resolve, reject) {
        let content = document.createElement('div');
        content.className = 'popup-content';
        if (typeof this.content === 'string') {
            content.innerText = this.content;
        }else {
            content.appendChild(this.content);
        }
        return content;
    }

    createPopupButtons(resolve, reject) {
        let buttons = document.createElement('div');
        buttons.className = 'popup-buttons';
        self.lastButton = null;
        for (let button of this.buttons) {
            let buttonElement = document.createElement('button');
            buttonElement.className = 'popup-button';
            if (button.class){
                buttonElement.classList.add(button.class);
            }
            buttonElement.innerText = button.text;
            if (resolve) {
                buttonElement.onclick = () => {
                    button.onclick(resolve, reject);
                }
            }else {
                buttonElement.onclick = button.onclick;
            }
            this.lastButton = buttonElement;
            buttons.appendChild(buttonElement);
        }
        return buttons;
    }

    modal(resolve, reject) {
        let modal = document.createElement('div');
        modal.id = 'popup-modal';
        modal.className = 'popup-modal';
        modal.addEventListener('click', () => {
            if (resolve) {
                resolve(null);
            }
            this.close();
        });
        document.body.appendChild(modal);
    }

    finish() {
        if(this.lastButton) {
            this.lastButton.focus();
        }
        if (this.load) {
            this.load();
        }
    }

    show() {
        this.modal();
        document.body.appendChild(this.createPopup());
        this.finish();
    }

    async get() {
        return new Promise((resolve, reject) => {
            this.modal(resolve, reject);
            document.body.appendChild(this.createPopup(resolve, reject));
            this.finish();
        });
    }

    close() {
        let popup = document.getElementById('popup');
        let modal = document.getElementById('popup-modal');
        popup.remove();
        modal.remove();
    }
}

function showPopupError(e) {
    let popup = new Popup({
        title: 'Error',
        classes: ['error'],
        content: e,
        buttons: [
            { text: 'OK', onclick: () => { popup.close() } }
        ]
    });
    popup.show();
}

class Form {
    constructor(def, item) {
        if (!def) {
            throw new Error('Form definition is required');
        }
        this.def = def;
        this.item = item;
        this.form = this.createForm();
    }

    createForm() {
        let form = document.createElement('form');
        form.className = 'popup-form';
        for (let field in this.def) {
            if(this.def[field].default) {
                continue;
            }
            form.appendChild(this.createField(field));
        }
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.resolve) {
                this.submit(this.resolve, this.reject);
            }else {
                this.submit();
            }
            if(this.end) {
                this.end();
            }
        });
        return form;
    }

    createField(field) {
        let fieldElement = document.createElement('div');
        fieldElement.className = 'popup-form-field';
        fieldElement.appendChild(this.createLabel(field));
        fieldElement.appendChild(this.createInput(field));
        return fieldElement;
    }

    createLabel(field) {
        let label = document.createElement('label');
        label.className = 'popup-form-label';
        label.innerText = this.def[field].label || field.firstUpperCase();
        return label;
    }

    createInput(field) {
        switch (this.def[field].type) {
            case 'text':
                this.def[field].tag = this.createTextInput(field); break;
            case 'select':
                this.def[field].tag = this.createSelectInput(field); break;
            case 'checkbox':
                this.def[field].tag = this.createCheckboxInput(field); break;
            case 'radio':
                this.def[field].tag = this.createRadioInput(field); break;
            case 'textarea':
                this.def[field].tag = this.createTextareaInput(field); break;
            case 'hidden':
                this.def[field].tag = this.createHiddenInput(field); break;
            case 'number':
                this.def[field].tag = this.createNumberInput(field); break;
            case 'date':
                this.def[field].tag = this.createDateInput(field); break;
            default:
                throw new Error('Unknown input type');
        }
        return this.def[field].tag;
    }

    createTextInput(field) {
        let input = document.createElement('input');
        input.className = 'popup-form-input';
        input.type = 'text';
        input.name = field;
        if (this.item) {
            input.value = this.item[field] || '';
        }
        if (!this.firstInput) {
            this.firstInput = input;
        }
        return input;
    }

    createSelectInput(field) {
        let input = document.createElement('select');
        input.className = 'popup-form-input';
        input.name = field;
        for (let option of this.def[field].options) {
            let selected = false;
            if (this.item && this.item[field] == option.value) {
                selected = true;
            }
            input.appendChild(this.createOption(option));
        }
        if (!this.firstInput) {
            this.firstInput = input;
        }
        return input;
    }

    createOption(option, selected) {
        let optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.innerText = option.text;
        if (selected) {
            optionElement.selected = true;
        }
        return optionElement;
    }

    createCheckboxInput(field) {
        let input = document.createElement('input');
        input.className = 'popup-form-input';
        input.type = 'checkbox';
        input.name = field;
        if (this.item && this.item[field]) {
            input.checked = true;
        }
        if (!this.firstInput) {
            this.firstInput = input;
        }
        return input;
    }

    createRadioInput(field) {
        let input = document.createElement('div');
        input.className = 'popup-form-input';
        input.type = 'radio';
        input.name = field;
        for (let option of this.def[field].options) {
            let selected = false;
            if (this.item && this.item[field] == option.value) {
                selected = true;
            }
            input.appendChild(this.createRadioOption(option, selected));
        }
        
        return input;
    }

    createRadioOption(option, selected) {
        let optionElement = document.createElement('div');
        optionElement.className = 'popup-form-radio-option';
        let input = document.createElement('input');
        input.type = 'radio';
        input.name = option.name;
        input.value = option.value;
        if (selected) {
            input.checked = true;
        }
        optionElement.appendChild(input);
        let label = document.createElement('label');
        label.innerText = option.text;
        optionElement.appendChild(label);
        if (!this.firstInput) {
            this.firstInput = optionElement;
        }
        return optionElement;
    }

    createTextareaInput(field) {
        let input = document.createElement('textarea');
        input.className = 'popup-form-input';
        input.name = field;
        if (this.item) {
            input.value = this.item[field] || '';
        }
        if (!this.firstInput) {
            this.firstInput = input;
        }
        return input;
    }

    createHiddenInput(field) {
        let input = document.createElement('input');
        input.className = 'popup-form-input';
        input.type = 'hidden';
        input.name = field;
        if (this.item) {
            input.value = this.item[field] || '';
        }
        return input;
    }

    createNumberInput(field) {
        let input = document.createElement('input');
        input.className = 'popup-form-input';
        input.type = 'number';
        input.name = field;
        if (this.item) {
            input.value = this.item[field] || '';
        }
        if (!this.firstInput) {
            this.firstInput = input;
        }
        return input;
    }

    createDateInput(field) {
        let input = document.createElement('input');
        input.className = 'popup-form-input';
        input.type = 'date';
        input.name = field;
        if (this.item) {
            input.value = this.item[field] || '';
        }
        if (!this.firstInput) {
            this.firstInput = input;
        }
        return input;
    }

    submit(resolve, reject) {
        let data = {};
        if (this.item) {
            data = this.item;
        }
        let required_field_error = [];
        for (let field in this.def) {
            if (this.def[field].required && !this.def[field].tag.value) {
                required_field_error.push(field);
            }
            if (required_field_error.length) {
                continue;
            }
            if (this.def[field].default) {
                data[field] = ((this.item && this.item.hasOwnProperty(field)) ? this.item[field] : this.def[field].default);
                continue;
            }
            if (this.def[field].type == 'checkbox') {
                data[field] = this.def[field].tag.checked;
            } else if (this.def[field].type == 'radio') {
                let radio = this.def[field].tag;
                for (let i = 0; i < radio.children.length; i++) {
                    let option = radio.children[i];
                    if (option.children[0].checked) {
                        data[field] = option.children[0].value;
                        break;
                    }
                }
            } else {
                data[field] = this.def[field].tag.value;
            }
        }
        if (required_field_error.length) {
            reject('Required fields: ' + required_field_error.join(', '));
            return;
        }
        if (resolve) {
            resolve(data);
        }
    }

}

async function showPopupForm(title, def, item) {
    let form = new Form(def, item);
    let popup = new Popup({
        title: title,
        resolve: form,
        content: form.form,
        load: () => {
            form.firstInput.focus();
        },
        buttons: [
            {
                text: 'Cancel',
                class: 'popup-button-cancel',
                onclick: (resolve, reject) => {
                    resolve(null);
                    popup.close();
                }
            },
            {
                text: 'Save',
                class: 'popup-button-save',
                onclick: (resolve, reject) => {
                    form.submit(resolve, reject);
                    popup.close();
                }
            },
        ]
    });
    form.end = () => {
        popup.close();
    };
    return await popup.get();
}