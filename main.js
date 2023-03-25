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

let prevent = false;
function initPromptEditor(mutations) {
    if (!prevent) {
        prevent = true;
        setTimeout(function() {
            Config.getOptions().then((options) => {
                UI.init();
                HandlerPromptTemplatesSelect.init(UI.prompt_select);
                HandlerPromptTemplatesOrinalText.init(UI.original_select);
                HandlerPromptTemplatesClickInit.init(UI.prompt_send_btn);
                HandlerPromptTemplatesClickSync.init(UI.prompt_sync_btn);
                HandlerPromptTemplatesClickEmpty.init(UI.prompt_empty_btn);
                HandlerSubPromptsSelect.init(UI.subprompt_select);
                HandlerSubPromptsList.init(UI.subprompt_list);
                HandlerFastResponsesList.init(UI.fastresponse);
                HandlerCopyAll.init(UI.copy_all);    
                HandlerCopyResponses.init(UI.copy_responses);
                HandlerCopyLast.init(UI.copy_last);
                prevent = false;
            });
        }, 100);
    }
}

initPromptEditor();

main_observer = new MutationObserver(initPromptEditor);
main_observer.observe(document.getElementById('__next'), {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: false
});

