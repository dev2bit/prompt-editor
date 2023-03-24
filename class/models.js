class Model {
  static data = [];

  static find (id) {
    return this.data.find(item => item.id == id);
  }

  static add (data) {
    if (!data.id) {
      data.id = Date.now();
    }
    this.data.push(data);
  }

  static delete (id) {
    this.data = this.data.filter(item => item.id != id);
  }
  
  constructor (id) {
    let data = {};
    if (id) {
      data = this.constructor.find(id);
    }
    Object.assign(this, data);
    return this;
  }
}

class ModelAjax extends Model {
  
  static url_get = null;
  static url_put = null;
  static storage_key = null;

  static async setData () {
    let models_data = this.data;
    if (!ModelAjax.url_put) {
      throw new Error('URL no defined');
    }
    if (!this.storage_key) {
        throw new Error('Not file');
    }
    let url_put = ModelAjax.url_put + this.storage_key + '.json?dummy=' + Date.now();
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', url_put , true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.onload = function() {
        if (xhr.readyState == 4) {
          if (xhr.status != 204) {
            reject(xhr.status);
          }
          else {
            resolve(xhr.status)
          }
        }
      };
      xhr.onerror = function(error) {
        reject(xhr.status);
      };
      xhr.send(JSON.stringify(models_data));
    });
  }

  static async getData () {
    return new Promise(async (resolve, reject) => {
        if (!ModelAjax.url_get) {
            throw new Error('URL no defined');
        }
        if (!this.storage_key) {
            throw new Error('Not file');
        }
        try {
            let url_get = ModelAjax.url_get + this.storage_key + '.json?dummy=' + Date.now();
            let response = await fetch(url_get + '?dummy=' + Date.now()).catch(error => {
                resolve([]);
            });
            let data = await response.json();
            this.data = data;
            resolve(data);
            return data;
        }catch (error) {
            resolve([]);
        }
    });
  }
}

class ModelLocalStorage extends Model {
  static storage_key = null;

  static async setData () {
    return new Promise((resolve, reject) => {
        if (!this.storage_key) {
            throw new Error('Storage key no defined');
        }
        let storage = {};
        storage[this.storage_key] = this.data;
        try {
            chrome.runtime.sendMessage({ accion: "setData", storage }, (response) => {
                console.log("Data saved in Chrome cloud:", response);
                resolve(response);
            });
        }catch (error) {
            console.error(error);
        }
    });
    
  }

  static async getData () {
    return new Promise((resolve, reject) => {
        if (!this.storage_key) {
            throw new Error('Storage key no defined');
        }

        chrome.runtime.sendMessage({ accion: "getData", keys: [this.storage_key] }, (response) => {
            console.log("Data getted from Chrome cloud:", response);
            if (!response.storage[this.storage_key]) {
                response.storage[this.storage_key] = [];
            }
            this.data = response.storage[this.storage_key];
            resolve(response.storage[this.storage_key]);
        });
    });
  }
}

class ModelGitHub extends Model {
    static token = null;
    static repository = null;
    static owner = null;
    static branch = null;
    static path = null;
    static storage_key = null;
    static sha = null;

    static getUrl (file){
        return `https://api.github.com/repos/${this.owner}/${this.repository}/contents${this.path}${file}.json`;
    }

    static async setData () {
        return new Promise((resolve, reject) => {
            let send_data = {
                message: "Update file",
                content: btoa(unescape(encodeURIComponent(JSON.stringify(this.data)))),
            };
            if(this.sha != null){
                send_data.sha = this.sha;
            }
            try {
                fetch(ModelGitHub.getUrl(this.storage_key), {
                    method: "PUT",
                    headers: {
                        Authorization: `token ${ModelGitHub.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(send_data),
                })
                .then((response) => response.json())
                .then((commitData) => {
                    this.sha = commitData.content.sha;
                    console.log("Archivo actualizado:", commitData);
                    resolve(commitData);
                })
                .catch((error) => {
                    console.error("Error al actualizar el archivo:", error);
                    reject(error);
                });
            }catch (error) {
                console.error(error);
                resolve();
            }
        });

    }
    
    static async getData () {
        return new Promise((resolve, reject) => {
            try{
                fetch(ModelGitHub.getUrl(this.storage_key), {
                    headers: {
                        Authorization: `token ${ModelGitHub.token}`,
                    },
                })
                .then((response) => response.json())
                .then((fileData) => {
                    if (fileData.sha){
                        this.sha = fileData.sha;
                        const fileContent = decodeURIComponent(escape(window.atob(fileData.content)));
                        console.log("Contenido del archivo:", fileContent);
                        this.data = JSON.parse(fileContent);
                        resolve(this.data);
                    }else{
                        resolve([]);
                    }
                });
            }catch (error) {
                console.error(error);
                resolve();
            }
        });

    }
}




var modelClass = ModelLocalStorage;


class PromptsModel extends modelClass {
    static storage_key = 'prompts_templates';
}

class SubpromptsModel extends modelClass {
    static storage_key = 'subprompts_templates';
}


class FastResponsesModel extends modelClass {
    static storage_key = 'fastresponses';
}

