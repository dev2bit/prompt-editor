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
let options = {};
chrome.runtime.sendMessage({ accion: "getData", keys: ["options"] }, (response) => {
    console.log("Data getted from Chrome cloud:", response);
    if (!response.storage.options) {
        response.storage.options = [];
    }
    options = response.storage.options;
    restore();
});

document.querySelector('#config-form').addEventListener('submit', () => {
    options = {
        'storage': document.querySelector('input[name="storage"]:checked').value,
        'github-token': document.querySelector('#github-token').value,
        'github-repository': document.querySelector('#github-repository').value,
        // 'github-branch': document.querySelector('#github-branch').value,
        'github-owner': document.querySelector('#github-owner').value,
        'github-path': document.querySelector('#github-path').value,
        'sync-get': document.querySelector('#sync-get').value,
        'sync-put': document.querySelector('#sync-put').value,
    };
    chrome.runtime.sendMessage({ accion: "setData", storage: { options } }, (response) => {
        alert('Options saved. You need to reload pages where you are using this extension.');
    });
});

document.querySelectorAll('input[name=storage]').forEach((element) => {
        element.addEventListener('change', () => {
        if (document.querySelector('input[name="storage"]:checked').value == 'github') {
            document.querySelectorAll('.github').forEach((element) => {
                element.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.github').forEach((element) => {
                element.style.display = 'none';
            });
        }
        if (document.querySelector('input[name="storage"]:checked').value == 'sync') {
            document.querySelectorAll('.sync').forEach((element) => {
                element.style.display = 'block';
            });
        } else {
            document.querySelectorAll('.sync').forEach((element) => {
                element.style.display = 'none';
            });
        }
    });
});

function restore () {
    document.querySelector('input[name="storage"][value="' + options['storage'] + '"]').checked = true;
    document.querySelector('#github-token').value = options['github-token'] || '';
    document.querySelector('#github-repository').value = options['github-repository'] || '';
    // document.querySelector('#github-branch').value = options['github-branch'] || 'master';
    document.querySelector('#github-path').value = options['github-path'] || '';
    document.querySelector('#github-owner').value = options['github-owner'] || '/';
    document.querySelector('#sync-get').value = options['sync-get'] || 'https://';
    document.querySelector('#sync-put').value = options['sync-put'] || 'https://';
    if(options['storage'] == 'github'){
        document.querySelectorAll('.github').forEach((element) => {
            element.style.display = 'block';
        });
    }
    else if (options['storage'] == 'sync') {
        document.querySelectorAll('.sync').forEach((element) => {
            element.style.display = 'block';
        });
    }
}