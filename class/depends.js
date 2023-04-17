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

const depends = {
    'main': 'main',
    'original_text': 'textarea[data-id]',
    'original_send': 'textarea[data-id] ~ button',
    'first_message': '.flex + .group',
    'first_message_btn': 'main .flex > .group',
    'new_btn': 'nav > a.py-3.px-3',
    'engine_selector': '.items-center button',
    'engine_selector_list': '.items-center li span > span',
    'engine_selector_current': 'span.flex.h-6.items-center.gap-1.truncate',
    'edit_message_btn': '.flex.text-gray-400 > .p-1.md\\:invisible',
    'edit_message_save': 'textarea.m-0 + .text-center > button.btn-primary',
    'stop_btn_container':'.h-full.flex > .ml-1.flex',
    'stop_btn': '.h-full.flex > .ml-1.flex > button',
    'msgs_all': 'main .flex > .group .text-base .flex-grow textarea, main .flex > .group .text-base .flex-grow .min-h-\\[20px\\] .markdown > *',
    'msgs_response': 'main .flex > .group.bg-gray-50 .text-base .flex-grow .min-h-\\[20px\\] .markdown > *',
    'msgs_last': 'main .flex > .group:nth-last-child(2) .text-base .flex-grow textarea, main .flex > .group:nth-last-child(2) .text-base .flex-grow .min-h-\\[20px\\]  .markdown > *',
};

async function getDepend (key) {
    let item = document.querySelector(depends[key]);
    if (item) {
        item.disabled = false;
    }
    return item;
    let trys = 0;
    return new Promise((resolve, reject) => {
        let interval = setInterval(() => {
            let depend = document.querySelector(depends[key]);
            if (depend) {
                clearInterval(interval);
                resolve(depend);
            } else if (trys >= 100) {
                clearInterval(interval);
                reject('Depend not found');
            }
            trys++;
        }, 100);
    });
};