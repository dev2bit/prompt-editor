let options = {};
chrome.runtime.sendMessage({ accion: "getData", keys: ["options"] }, (response) => {
    console.log("Data getted from Chrome cloud:", response);
    if (!response.storage.options) {
        response.storage.options = [];
    }
    options = response.storage.options;
    restore();
});

document.querySelector('#save').addEventListener('click', () => {
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