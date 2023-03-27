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
class UI {
  static async init () {
    UI.main = document.querySelector(depends.main);
    UI.new_btn = document.querySelector(depends.new_btn);
    UI.parent = UI.main.parentElement;
    UI.original_text = document.querySelector(depends.original_text);
    UI.original_send = document.querySelector(depends.original_send);
    UI.createUI();
  }

  static createUI (target) {
    target = target || UI.parent;
    target.style.flex = 'none';
    target.style['flex-direction'] = 'row';
    target.ui = document.createElement('div');
    target.ui.id = 'prompts-ui';
    UI.createPromptBlock(target.ui);
    UI.createFastResponseBlock(target.ui);
    UI.createOriginalTextBlock(target.ui);
    UI.createFloatBottomBlock(target.ui);
    target.prepend(target.ui);
  }

  static createFloatBottomBlock (target) {
    target.float_bottom = document.createElement('div');
    target.float_bottom.id = 'prompts-float-bottom';

    UI.copy_all = document.createElement('button');
    UI.copy_all.id = 'prompts-copy-all';
    UI.copy_all.classList.add('fa');
    UI.copy_all.classList.add('fa-copy');
    UI.copy_all.title = 'Copy all';
    target.float_bottom.appendChild(UI.copy_all);

    UI.copy_responses = document.createElement('button');
    UI.copy_responses.id = 'prompts-copy-responses';
    UI.copy_responses.classList.add('fa');
    UI.copy_responses.classList.add('fa-copy');
    UI.copy_responses.title = 'Copy responses';
    target.float_bottom.appendChild(UI.copy_responses);

    UI.copy_last = document.createElement('button');
    UI.copy_last.id = 'prompts-copy-last';
    UI.copy_last.classList.add('fa');
    UI.copy_last.classList.add('fa-copy');
    UI.copy_last.title = 'Copy last';
    target.float_bottom.appendChild(UI.copy_last);
    

    target.appendChild(target.float_bottom);
  }

  static createOriginalTextBlock (target) {
        UI.original_select = target.prompt_select = document.createElement('select');
        UI.original_select.id = 'prompts-prompt-control-original';
        
        UI.original_text.insertAdjacentElement('afterend', UI.original_select);
  }

  static createPromptBlock (target) {
    target.promptsblock = document.createElement('div');
    target.promptsblock.id = 'prompts-prompt';
    target.classList.add('notranslate');
    target.appendChild(target.promptsblock);
    UI.createPromptControlsTop(target.promptsblock);
    UI.createPromptTextArea(target.promptsblock);
    UI.createPromptListSubprompts(target.promptsblock);
    UI.createPromptControlsBottom(target.promptsblock);
  }

  static createFastResponseBlock (target) {
    UI.fastresponse = target.fastresponse = document.createElement('div');
    target.fastresponse.id = 'prompts-fastresponse';
    target.appendChild(target.fastresponse);
  }

  static createPromptControlsTop (target) {
    target.controls_top = document.createElement('div');
    target.controls_top.id = 'prompts-prompt-control';
    UI.createPromptControlsTopLabelTitle (target.controls_top);
    UI.createPromptControlsTopSelectPrompt (target.controls_top);
    UI.createPromptControlsTopOptions (target.controls_top);
    target.appendChild(target.controls_top);
  }

   static async createPromptControlsTopLabelTitle (target) {
    let src = await chrome.runtime.getURL("assets/img/logo.png");
    target.block_title = document.createElement('img');
    target.block_title.id = 'prompts-prompt-control-title';
    target.block_title.src = src;
    target.prepend(target.block_title);
    return target.block_title;
  }

  static createPromptControlsTopSelectPrompt (target) {
    UI.prompt_select = target.prompt_select = document.createElement('select');
    target.prompt_select.id = 'prompts-prompt-control-prompts';
    target.appendChild(target.prompt_select);
  }

  static createPromptControlsTopOptions (target) {
    let option = document.createElement('a');
    option.innerText = "";
    option.title = "New Prompt";
    option.href = "#";
    option.classList.add('fa');
    option.classList.add('fa-file');
    UI.prompt_empty_btn = option;

    option.id = 'prompts-prompt-control-empty';

    target.appendChild(option);

  }

  static createPromptTextArea (target) {
    UI.prompt_text = target.textarea = document.createElement('textarea');
    target.textarea.id = 'prompts-textarea';
    target.appendChild(target.textarea);
    UI.prompt_simplemde = new SimpleMDE({ 
        element: UI.prompt_text,
        spellChecker: false,
    });
  }

  static createPromptControlsBottom (target) {
    target.controls_bottom = document.createElement('div');
    target.controls_bottom.id = 'prompts-prompt-control-bottom';
    target.appendChild(target.controls_bottom);
    UI.createPromptControlsBottomSelectSubprompt(target.controls_bottom);
    UI.createPromptOptions(target.controls_bottom);
    UI.createPromptControlsBottomButtonSync(target.controls_bottom);
    UI.createPromptControlsBottomButtonInit(target.controls_bottom);
  }

  static createPromptListSubprompts (target) {
    UI.subprompt_list = target.subprompt_list = document.createElement('div');
    target.subprompt_list.id = 'prompts-prompt-subprompts-list';
    target.appendChild(target.subprompt_list);
  }

  static createPromptOptions (target) {
    let option = document.createElement('a');
    option.innerText = "";
    option.href = "#";
    option.title = "Extension Options";
    option.classList.add('fa');
    option.classList.add('fa-gear');

    option.id = 'prompts-prompt-control-options';
    option.addEventListener('click', () => {
        chrome.runtime.sendMessage({ accion: "Options" }, (response) => {});
        return false;
    });
    target.appendChild(option);

  }

  static createPromptControlsBottomButtonInit (target) {
    UI.prompt_send_btn = target.button_init = document.createElement('button');
    target.button_init.id = 'prompts-prompt-control-bottom-button-init';
    target.button_init.innerText = 'Run';
    target.button_init.title = 'Run Prompt';
    target.appendChild(target.button_init);
  }

  static createPromptControlsBottomButtonSync (target) {
    UI.prompt_sync_btn = target.button_sync = document.createElement('button');
    target.button_sync.id = 'prompts-prompt-control-bottom-button-sync';
    target.button_sync.classList.add('fa');
    target.button_sync.classList.add('fa-save');
    target.button_sync.title = 'Save Prompt';
    target.appendChild(target.button_sync);
  }

  static createPromptControlsBottomSelectSubprompt (target) {
    UI.subprompt_select = target.subprompt_select = document.createElement('select');
    target.subprompt_select.id = 'prompts-prompt-control-subprompts';
    target.appendChild(target.subprompt_select);
  }

}