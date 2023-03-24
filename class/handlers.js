class Target {
    static value = null;
    static model = null;
}

class HandlerTarget {
    static target = null;

    static init () {
        if (!this.target) {
            throw new Error('Target not defined');
        }
    }
}

class HandlerTargetSelect extends HandlerTarget{
  static select = null;
  static selected = null;
  static select_nice = null;
  static is_nice = true;
  static is_nice_search = true;
  static is_nice_edit = true;
  static default = 'Select item';
  static form = {};
  static entity = "";
  static is_new_items_selected = true;
  static is_edit_items_selected = false;
  static has_add_btn = true;

  static init (select) {
    if (!this.target) {
        throw new Error('Target not defined');
    }
    if (!select) {
        throw new Error('Select not defined');
    }
    this.select = select;
    this.select.addEventListener('change', async () => {
      this.select_item();
      this.target.value = this.target.model.find(this.selected);
      this.change(this.target.model.find(this.selected));
      if (this.select_nice){
        this.select_nice.updated = false;
        this.update();
      }
    });
    this.select.addEventListener('keypress', (e) => {
        if (e.keyCode == 13) {
            this.select_item();
            this.target.value = this.target.model.find(this.selected);
            this.change(this.target.model.find(this.selected));    
        }
        this.keypress(e);
        if (this.select_nice){
            this.select_nice.update();
        }
    });
    this.init_controls();
    if (this.select_nice) {
        this.select_nice.updated = false;
    }
    this.update();
  }

  static init_controls () {
    const block = document.createElement('div');
    block.classList.add('select-block');
    block.id = "block-" + this.select.id;

    const block_controls = document.createElement('div');
    block_controls.classList.add('select-controls');
    
    if (this.has_add_btn) {
        const add_btn = document.createElement('span');
        add_btn.classList.add('select-controls-add');
        add_btn.title = "Add new";
        add_btn.innerText = '+';
        add_btn.addEventListener('click', async () => {
            try{
                let data = null;
                if(data = await showPopupForm("Add new " + this.entity, this.form).catch(e => { 
                    throw new Error(e);
                })){
                    // this.select.value = "";
                    // this.selected = null;
                    // this.target.value = null;
                    await this.target.model.add(data);
                    await this.target.model.setData();
                    await this.update(true);
                    if (this.is_new_items_selected) {
                        this.select.value = data.id;
                        this.selected = data.id;
                        this.target.value = this.target.model.find(this.selected);
                        this.select.dispatchEvent(new Event('change'));
                    }
                    if (this.new_item) {
                        this.new_item(data);
                    }
                }
            }catch(e){
                showPopupError(e.message);
                this.update(true);
            }
        });
        block_controls.appendChild(add_btn);
    }else {
        block.classList.add('select-controls-no-add');
    }

    let parent = this.select.parentNode;
    let next = this.select.nextSibling;
    block.append(this.select);
    block.appendChild(block_controls);

    parent.insertBefore(block, next);

    
    if (this.is_nice) {
        var options = {searchable: this.is_nice_search, placeholder: this.default};
        this.select_nice = NiceSelect.bind(this.select,options);
        
    }
  }

  static promptData () {
    return {};  
  }

  static delete () {}

  static select_item () {
    this.selected = this.select.value;
  }

  static change (item) {
    console.log(item);
  }

  static keypress (e) {
    console.log(e);
  }

  static async update (not_refresh) {
    
    this.remove_options();
    let data = await this.target.model.data;
    if (!not_refresh) {
        data = await this.target.model.getData();
    }
    if (!this.is_nice){
        const defaultOption = document.createElement('option');
        defaultOption.innerText = this.default;
        defaultOption.value = '';
        defaultOption.dataset.display = this.default;
        this.select.appendChild(defaultOption);
    }

    data.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1).forEach(item => {
      const option = document.createElement('option');
      option.innerText = item.title;
      option.value = item.id;
      option.dataset.id = item.id;
      if (item.id == this.selected) {
        option.selected = true;
      }
      this.select.appendChild(option);
    });
    if (this.select_nice && !this.select_nice.updated){
        this.select_nice.updated = true;
        let li = null;
        await this.select_nice.update();
        if (li = document.querySelector('#block-' + this.select.id + ' .list li[data-value="' + this.selected + '"]')){
            let text = this.target.model.find(this.selected).title;
            document.querySelector('#block-' + this.select.id + ' .current').innerText = text;
        }            
        setTimeout(() => {
            document.querySelectorAll('#block-' + this.select.id + ' .list li').forEach(item => {
                if (this.is_nice_edit){
                    var edit = document.createElement('span');
                    edit.classList.add('select-controls-edit');
                    edit.title = "Edit";
                    edit.classList.add('fa');
                    edit.classList.add('fa-pencil');
                    edit.innerHTML = ' ';
                    edit.addEventListener('click', async (event) => {
                        event.stopPropagation();
                        try{
                            let data_item = this.target.model.find(item.dataset.value);
                            if (data_item){
                                if (await showPopupForm("Edit " + this.entity, this.form, data_item).catch(e => {
                                    throw new Error(e);
                                })){
                                    if (this.is_edit_items_selected) {
                                        this.select.value = data_item.id;
                                        this.selected = data_item.id;
                                        this.target.value = data_item;
                                        this.change(data_item);
                                    }
                                    await this.update(true);
                                    this.target.model.setData();
                                    
                                }
                            }
                        }catch(e){
                            showPopupError(e.message);
                        }
                        this.update(true);
                    });
                    item.appendChild(edit);
                }
                var del = document.createElement('span');
                del.classList.add('select-controls-del');
                del.title = "Delete";
                del.classList.add('fa');
                del.classList.add('fa-trash');
                del.innerHTML = ' ';
                del.addEventListener('click', (event) => {
                    event.stopPropagation();
                    if(confirm("Are you sure?")){
                        this.target.model.delete(item.dataset.value);
                        this.update(true);
                        this.target.model.setData();
                        this.delete();
                    }
                });
                item.appendChild(del);
            });
            this.select_nice.updated = false;
        }, 1000);
    }
  }
  static remove_options () {
    while (this.select.firstChild) {
      this.select.removeChild(this.select.firstChild);
    }
  }
}

class HandlerTargetList extends HandlerTarget{
  static container = null;
  static selected = null;
  static form = null;
  static entity = "";

  static init (container) {
    if (!this.target) {
        throw new Error('Target not defined');
    }
    if (!container) {
        throw new Error('Container not defined');
    }
    this.container = container;
    this.init_controls();
    this.update();
  }

  static init_controls () {
    this.list = document.createElement('ul');
    this.list.classList.add('list-block');
    this.list.id = "list-" + this.container.id;
    this.container.appendChild(this.list);

    const block_controls = document.createElement('div');
    block_controls.classList.add('list-controls');
    

    const add_btn = document.createElement('span');
    add_btn.classList.add('select-controls-add');
    add_btn.title = "Add new";
    add_btn.innerText = '+';
    add_btn.addEventListener('click', async () => {
        try {
            let data = null;
            if (data = await showPopupForm("Add " + this.entity, this.form).catch(e => {
                throw new Error(e);
            })){
                await this.target.model.add(data);
                await this.update(true);
                this.target.model.setData();
            }
        } catch (e) {
            showPopupError(e.message);
        }
    });
    block_controls.appendChild(add_btn);

    this.container.appendChild(block_controls);

  }

  static promptData () {
    return {};  
  }


  static change (item) {
    console.log(item);
  }

  static async update (not_refresh) {
    
    this.remove_options();
    let data = this.target.model.data;
    if (!not_refresh) {
        data = await this.target.model.getData();
    }

    this.list.classList.remove('two-columns');
    if (data.length > 8) {
        this.list.classList.add('two-columns');
    }

    data.sort((a, b) => a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1).forEach(item => {
        const option = document.createElement('li');
        option.value = item.id;
        option.dataset.id = item.id;
        if (item.id == this.constructor.selected) {
            option.classList.add('selected');
        }
        const option_title = document.createElement('span');
        option_title.innerText = item.title;
        option_title.classList.add('list-item-title');
        option.appendChild(option_title);
        const option_edit = document.createElement('span');
        option_edit.innerText = " ";
        option_edit.classList.add('list-item-edit');
        option_edit.classList.add('fa');
        option_edit.classList.add('fa-pencil');
        option_edit.addEventListener('click', async(event) => {
            event.stopPropagation();
            try{
                if (item){
                    if (await showPopupForm("Edit " + this.entity, this.form, item).catch(e => {
                        throw new Error(e);
                    })){
                        this.update(true);
                         this.target.model.setData();
                    }
                }
            }catch(e){
                showPopupError(e.message);
            }
        });
        option.appendChild(option_edit);


        const option_del = document.createElement('span');
        option_del.innerText = " ";
        option_del.classList.add('list-item-del');
        option_del.classList.add('fa');
        option_del.classList.add('fa-trash');
        option_del.addEventListener('click', (event) => {
            event.stopPropagation();
            if (confirm("Delete?")) {
                this.target.model.delete(item.id);
                this.update(true);
                this.target.model.setData();
            }
        });
        option.appendChild(option_del);

        option.addEventListener('click', () => {
            this.selected = item.id;
            this.target.value = this.target.model.find(this.selected);
            this.change(this.target.model.find(this.selected));
        });
        
        this.list.appendChild(option);
    });
  }
  static remove_options () {
    while (this.list && this.list.firstChild) {
      this.list.removeChild(this.list.firstChild);
    }
  }
}

class HandlerTargetClick extends HandlerTarget {
    static item = null;

    static init (item) {
        if (!this.target) {
            throw new Error('Target not defined');
        }
        if (!item) {
            throw new Error('Item not defined');
        }
        this.item = item;
        this.item.addEventListener('click', () => {
            this.click(this.target.value);
        });
    }
}
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
    static select_version = null;
    static async click (item) {
        const btn_first = document.querySelector('.text-base .p-1');
        if (btn_first) {
            let btn_new = document.querySelector('nav a.mb-2');
            if (btn_new) {
                btn_new.click();
                await new Promise(r => setTimeout(r, 200));
                if (this.select_version){
                    document.querySelector('.items-center button').click();
                    await new Promise(r => setTimeout(r, 200));
                    document.querySelectorAll('.items-center li span > span').forEach(item => {
                        if (item.innerHTML == this.select_version) {
                            item.click();
                        }
                    });
                }
            }
        }else {
            this.select_version = document.querySelector('span.flex.h-6.items-center.gap-1.truncate');
            if (this.select_version) {
                this.select_version = this.select_version.innerHTML;
            }
        }
        UI.original_text.value = UI.prompt_simplemde.value();
        const button = UI.original_send;
        UI.main.classList.add('prompt-editor-run');
        button.click();
        setTimeout(() => {
            const block_first = document.querySelector('.flex + .group');
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

/*------------------ Init ------------------*/

class Handlers {
    static init () {
        if (!UI.prompt_select){
            UI.init();
        }
        Options.getOptions().then((options) => {
            HandlerPromptTemplatesSelect.init(UI.prompt_select);
            HandlerPromptTemplatesOrinalText.init(UI.original_select);
            HandlerPromptTemplatesClickInit.init(UI.prompt_send_btn);
            HandlerPromptTemplatesClickSync.init(UI.prompt_sync_btn);
            HandlerPromptTemplatesClickEmpty.init(UI.prompt_empty_btn);
            HandlerSubPromptsSelect.init(UI.subprompt_select);
            HandlerSubPromptsList.init(UI.subprompt_list);
            HandlerFastResponsesList.init(UI.fastresponse);
            UI.original_send.addEventListener('click', () => {
                if (HandlerPromptTemplatesOrinalText.target.value){
                    let template = HandlerPromptTemplatesOrinalText.target.value.template;
                    let text = UI.original_text.value;
                    let result = template.replace(/\[\[PROMPT\]\]/g, text);
                    UI.original_text.value = result;
                    HandlerPromptTemplatesOrinalText.select.value = "";
                    HandlerPromptTemplatesOrinalText.target.value = null;
                    HandlerPromptTemplatesOrinalText.selected = "";
                    setTimeout(() => {
                        const block_first = document.querySelector('.flex + .group');
                        if (block_first) {
                            block_first.style.display = 'none';
                        }
                    }, 200);
                }
            });
        });
        
    }   
}

