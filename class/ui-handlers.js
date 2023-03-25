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

let cache_input = null; // cache input for prompt. prevent clear input by others extensions

//------------------ Prompt ------------------//

class TargetPrompt {
    static model = PromptsModel;
}

class HandlerPromptTemplatesSelect extends HandlerTargetSelect {
    static target = TargetPrompt;
    static select_nice = null;
    static default = 'Prompts';
    static entity = 'prompt';
    static has_add_btn = false;
    static form = {
        title: {
            type: 'text',
            label: 'Title',
            required: true,
        },
        template: {
            default: '[[PROMPT]]',
        },
    };


    static new_item (data) {
        HandlerPromptTemplatesClickSync.set_sync();
    }

    static change (item) {
        let prompt_text = UI.original_text.value.trim();
        if (item) {
            let text = item.template;
            if (item.template != '[[PROMPT]]') {
                text = item.template.replace('[[PROMPT]]', '[[' + prompt_text + ']]');
            }
            UI.prompt_simplemde.value(text);
        }else {
            UI.prompt_simplemde.value('');
        }
        HandlerPromptTemplatesClickSync.set_sync();
        cache_input = UI.original_text.value;
    }

    static promptData () {
        let title = prompt('Title', '');
        if (!title) {
            throw new Error('Title is empty');
        }
        UI.prompt_simplemde.value('');
        UI.prompt_simplemde.codemirror.setCursor(0, 0);
        UI.prompt_simplemde.codemirror.focus();
        return {'title': title, 'template': ""};
    }

    static keypress (e) {
        cache_input = UI.original_text.value;
        if (e.keyCode == 13) {
            e.preventDefault();
            HandlerPromptTemplatesClickInit.click(this.target.value);
            this.selected = "";
            this.select.value = "";
            this.target.value = null;
            UI.original_text.focus();
        }
    }

    static delete (){
        UI.prompt_simplemde.value('');
    }
}

class HandlerPromptTemplatesOrinalText extends HandlerPromptTemplatesSelect {
    static target = TargetPrompt;
    static is_nice = false; 
    static select_nice = null;
    static select_version = null;
    static engine_observer = null;


    static init (select) {
        super.init(select);
        UI.original_send.addEventListener('click', () => {
            HandlerPromptTemplatesOrinalText.replace();
        });
        UI.original_text.addEventListener('keydown', (e) => {
            if (e.keyCode == 13){
                HandlerPromptTemplatesOrinalText.replace();
            }
        });
        UI.original_text.addEventListener('keyup', (e) => {
            cache_input = UI.original_text.value;
        });
        UI.new_btn.addEventListener('click', () => {
            HandlerPromptTemplatesOrinalText.set_engine_version();
        });
        setTimeout(() => {
            function change_engine_version () {
                HandlerPromptTemplatesOrinalText.get_engine_version();
                console.log('get_engine_version ', HandlerPromptTemplatesOrinalText.select_version);
            }
            this.engine_observer = new MutationObserver(change_engine_version);
            this.engine_observer.observe(document.querySelector(depends.engine_selector), {
                attributes: true,
                childList: true,
                characterData: true,
            });
        }, 700);        
        setTimeout(() => {
            function add_btn () {
                setTimeout(() => {
                    let element = document.querySelector(depends.stop_btn);
                    if (element) {
                        element.addEventListener('click', () => {
                            setTimeout(() => { 
                                UI.original_text.focus();
                            }, 200);
                        });
                    }
                }, 200);
            }
            this.engine_observer = new MutationObserver(add_btn);
            this.engine_observer.observe(document.querySelector(depends.stop_btn_container), {
                attributes: true,
                childList: true,
                characterData: true,
            });
        }, 700);
        this.openedit();
    }
    static openedit ()  {
        setTimeout(() => {
            document.querySelectorAll(depends.edit_message_btn).forEach(item => {
                let parent = item.parentElement.parentElement.parentElement;
                item.click();
                setTimeout(() => {
                parent.querySelectorAll(depends.edit_message_save).forEach(item => {
                        item.addEventListener('click', () => {
                            this.openedit ();
                        });
                });
                }, 200);
            });
        }, 200);
    }

    static replace () {
        if (this.target.value){
            let template = HandlerPromptTemplatesOrinalText.target.value.template;
            let text = cache_input;
            let result = template.replace(/\[\[PROMPT\]\]/g, text);
            UI.original_text.value = result;
            this.select.value = "";
            this.target.value = null;
            this.selected = "";
            setTimeout(() => {
                const block_first = document.querySelector(depends.first_message);
                if (block_first) {
                    block_first.style.display = 'none';
                }
            }, 200);
        }
        this.openedit();
    }

    static get_engine_version () {
        this.select_version = document.querySelector(depends.engine_selector_current);
        if (this.select_version) {
            this.select_version = this.select_version.innerHTML;
        }
    }

    static async set_engine_version () {
        await new Promise(r => setTimeout(r, 400));
        if (HandlerPromptTemplatesOrinalText.select_version){
            document.querySelector(depends.engine_selector).click();
            await new Promise(r => setTimeout(r, 200));
            document.querySelectorAll(depends.engine_selector_list).forEach(item => {
                if (item.innerHTML == HandlerPromptTemplatesOrinalText.select_version) {
                    item.click();
                }
            });
            setTimeout(() => {
                UI.original_text.focus();
            }, 200);
        }
    }

}

class HandlerPromptTemplatesClickEmpty extends HandlerTargetClick {
    static target = TargetPrompt;
    static select_version = null;
    static async click (item) {
        HandlerPromptTemplatesSelect.select.value = "";
        HandlerPromptTemplatesSelect.selected = "";
        HandlerPromptTemplatesSelect.target.value = null;
        UI.prompt_simplemde.value('');
        HandlerPromptTemplatesSelect.select.dispatchEvent(new Event('change'));
    }
}

class HandlerPromptTemplatesClickInit extends HandlerTargetClick {
    static target = TargetPrompt;
    static async click (item) {
        const btn_first = document.querySelector(depends.first_message_btn);
        if (btn_first) {
            if (UI.new_btn) {
                UI.new_btn.click();
                HandlerPromptTemplatesOrinalText.set_engine_version();
                await new Promise(r => setTimeout(r, 500));
            }
        }else {
            HandlerPromptTemplatesOrinalText.get_engine_version();
        }
        UI.original_text.value = UI.prompt_simplemde.value();
        const button = UI.original_send;
        UI.main.classList.add('prompt-editor-run');
        button.click();
        setTimeout(() => {
            const block_first = document.querySelector(depends.first_message);
            if (block_first) {
                block_first.style.display = 'none';
            }
        }, 200);
    }
}

class HandlerPromptTemplatesClickSync extends HandlerTargetClick {
    static target = TargetPrompt;
    static init (item) {
        super.init(item);
        UI.prompt_simplemde.codemirror.on("change", () => {
	        this.set_no_sync();
        });
    }
    static set_no_sync () {
        this.item.classList.add('no-sync');
    }    
    
    static set_sync () {
        this.item.classList.remove('no-sync');
    }

    static async click (item) {
        try {
            await HandlerPromptTemplatesSelect.target.model.getData();
            if (item) {
                item = HandlerPromptTemplatesSelect.target.model.find(item.id);
            }else {
                item = {};
                PromptsModel.add(item);
                if (!await showPopupForm("New Prompt", HandlerPromptTemplatesSelect.form, item).catch(e => {
                    throw e;
                })) {
                    return;
                }
            }
            let template = UI.prompt_simplemde.value().replace(/\[\[.*\]\]/g, '[[PROMPT]]');
            item.template = template;
            await HandlerPromptTemplatesSelect.update(true);    
            await HandlerPromptTemplatesSelect.target.model.setData();
            HandlerPromptTemplatesClickSync.set_sync();
            HandlerPromptTemplatesSelect.select.value = item.id;
            HandlerPromptTemplatesSelect.selected = item.id;
            HandlerPromptTemplatesSelect.target.value = this.target.model.find(item.id);
            HandlerPromptTemplatesSelect.select.dispatchEvent(new Event('change'));
        }catch (e) {
            console.log(e);
        }
    }
}

//------------------ Subprompt ------------------//
class TargetSubprompt {
    static model = SubpromptsModel;
}

class HandlerSubPromptsSelect extends HandlerTargetSelect {
    static target = TargetSubprompt;
    static is_nice_search = false;
    static default = 'Insert fast instruction';
    static entity = 'subprompt';
    static is_new_items_selected = false;
    static form = {
        'title': {
            'label': 'Title',
            'type': 'text',
            'required': true,
        },
        'text': {
            'label': 'Text',
            'type': 'textarea',
            'required': true,
        },
    };
    static update (not_refresh, jump) {
        super.update(not_refresh);
         if (jump) return;
        HandlerSubPromptsList.update(not_refresh, true);
    }
    
    static change (item) {
        var cm = UI.prompt_simplemde.codemirror;
        var startPoint = cm.getCursor('start');
        var endPoint = cm.getCursor('end');
        cm.replaceRange(item.text, startPoint, endPoint);
        this.selected = "";
        this.select.value = "";
        this.target.value = null;
        let text = item.text + ((item.text[item.text.length - 1] == '.' || item.text[item.text.length - 1] == ' ') ? '' : ' ');
        let last_line = text.split('\n')[text.split('\n').length - 1];
        endPoint.ch += last_line.length;
        endPoint.line += text.split('\n').length - 1;
        UI.prompt_simplemde.codemirror.setCursor(endPoint);
        UI.prompt_simplemde.codemirror.focus();
    }       

    static promptData () {
        let title = prompt('Title', '');
        let text = prompt('Text', '');
        if (!text || !title){
            throw new Error('Title and text are required');
        }
        text = text.replace(/\/\/n/g, '\n');
        return {title, text};
    }
}

class HandlerSubPromptsList extends HandlerTargetList {
    static target = TargetSubprompt;
    static entity = 'subprompt';
    static form = {
        'title': {
            'label': 'Title',
            'type': 'text',
            'required': true,
        },
        'text': {
            'label': 'Text',
            'type': 'textarea',
            'required': true,
        },
    };

    static update (not_refresh, jump) {
        super.update(not_refresh);
        if (jump) return;
        HandlerSubPromptsSelect.update(not_refresh, true);
    }

    static promptData () {
        return HandlerSubPromptsSelect.promptData();
    }

    static change (item) {
        HandlerSubPromptsSelect.change(item);
    }

}

//------------------ FastResponses ------------------//
class TargetFastResponse {
    static model = FastResponsesModel;
}

class HandlerFastResponsesList extends HandlerTargetList {
    static target = TargetFastResponse;
    static form = {
        'title': {
            'label': 'Title',
            'type': 'text',
            'required': true,
        },
        'text': {
            'label': 'Text',
            'type': 'textarea',
            'required': true,
        },
    };
    static entity = 'fast response';

    
    
    static promptData () {
        let title = prompt('Title', '');
        let text = prompt('Text', '');
        if (!title ||  !text){
            throw new Error('Title and text are required');
        } 
        return {title, text};
    }

    static change (item) {
        UI.original_text.value = item.text;
        const button = UI.original_send;
        button.click();
    }
}

//------------------ Copys ------------------//
class HandlerCopy extends HandlerTargetClick {
    static target = null;
    static get_text (selector) {
        let text = '';
        document.querySelectorAll(selector).forEach((el) => {
            if (el.querySelector('h1') || el.tagName == 'H1') {
                text += '# ';
            }
            else if (el.querySelector('h2') || el.tagName == 'H2') {
                text += '## ';
            }
            else if (el.querySelector('h3') || el.tagName == 'H3') {
                text += '### ';
            }
            else if (el.querySelector('h4') || el.tagName == 'H4') {
                text += '#### ';
            }
            else if (el.querySelector('h5') || el.tagName == 'H5') {
                text += '##### ';
            }
            else if (el.querySelector('h6') || el.tagName == 'H6') {
                text += '###### ';
            }   
            else if (el.querySelector('blockquote') || el.tagName == 'BLOCKQUOTE') {
                text += '> ';
            }
            else if (el.querySelector('ol') || el.tagName == 'OL') {
                el.querySelectorAll('ol').forEach((li, i) => {
                    text += `${i + li.textContent}.\n`;
                });
                return;
            }
            else if (el.querySelector('code') || el.tagName == 'CODE') {
                el.querySelectorAll('code').forEach((li, i) => {
                    text += `\`\`${li.textContent}\`\`\n\n`;
                });
                return;
            }
            else if (el.querySelector('hr') || el.tagName == 'HR') {
                text += '---';
            }
            else if (el.querySelector('li') || el.tagName == 'LI') {
                el.querySelectorAll('li').forEach((li, i) => {
                    text += `* ${li.textContent}\n`;
                });
                return;
            }
            text += el.textContent + '\n\n';
        });
        return text;
    }

    static copyClipboard (text) {
        const elem = document.createElement("textarea");
        elem.value = text;
        // elem.style.display = "none";
        document.body.appendChild(elem);
        elem.select();
        elem.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.body.removeChild(elem);
    }
}

class HandlerCopyAll extends HandlerCopy {
    static target = null;
    static click () {
        let text = this.get_text(depends.msgs_all);
        this.copyClipboard(text);
    }
}

class HandlerCopyResponses extends HandlerCopy {
    static target = null;
    static click () {
        let text = this.get_text(depends.msgs_response);
        this.copyClipboard(text);
    }
}

class HandlerCopyLast extends HandlerCopy {
    static target = null;
    static click () {
        let text = this.get_text(depends.msgs_last);
        this.copyClipboard(text);
    }
}


