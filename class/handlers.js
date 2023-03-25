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

  static change (item) {}

  static keypress (e) {}

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


  static change (item) {}

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
        if (!item) {
            throw new Error('Item not defined');
        }
        this.item = item;
        this.item.addEventListener('click', () => {
            this.click(this.target ? this.target.value : null);
        });
    }
}