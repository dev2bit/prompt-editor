class Options {
    static options = null;

    static async getOptions () {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ accion: "getData", keys: ["options"] }, (response) => {
                if (this.options ) {
                    resolve(this.options);
                    return;
                }
                if (response.storage.options){
                    let options = response.storage.options;
                    if (options['storage'] == 'local') {
                        mixin (PromptsModel, ModelLocalStorage);
                        mixin (SubpromptsModel, ModelLocalStorage);
                        mixin (FastResponsesModel, ModelLocalStorage);
                    }
                    else if (options['storage'] == 'github') {
                        ModelGitHub.token = options['github-token'];
                        ModelGitHub.repository = options['github-repository'];
                        ModelGitHub.owner = options['github-owner'];
                        ModelGitHub.branch = options['github-branch'];
                        ModelGitHub.path = options['github-path'];
                        mixin (PromptsModel, ModelGitHub);
                        mixin (SubpromptsModel, ModelGitHub);
                        mixin (FastResponsesModel, ModelGitHub);
                    }
                    else if (options['storage'] == 'sync') {
                        ModelAjax.url_get = options['sync-get'];
                        ModelAjax.url_put = options['sync-put'];
                        mixin (PromptsModel, ModelAjax);
                        mixin (SubpromptsModel, ModelAjax);
                        mixin (FastResponsesModel, ModelAjax);
                    }
                    this.options = options;
                    resolve(options);
                }else{
                    this.options = {
                        'storage': 'local',
                    };
                    resolve(this.options);
                }
            });
        });
    }
}

function mixin(target, source) {
    target.getData = source.getData;
    target.setData = source.setData;
}