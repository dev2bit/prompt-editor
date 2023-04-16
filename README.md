# Prompt Editor

<p align="center">
  <br/>
  <img src="https://raw.githubusercontent.com/dev2bit/prompt-editor/master/assets/img/logo.png">
  <br/>
</p>

Prompt Editor is a Google Chrome extension designed to manage and edit prompts efficiently and effortlessly. Initially integrated with ChatGPT, the project aims to expand its compatibility with other language models in the future.

## Features
* **Intuitive Interface:** Create and edit prompts with a clean and straightforward interface.
* **Flexible Storage and Sharing:** Save and share your prompts using different methods - locally, on a private web server, or in a GitHub repository.
* **Customizable Instructions and Subcontexts:** Insert predefined instructions or subcontexts into prompts, with the ability to add your own custom variations.
* **Prompt Preloading and Execution:** Preload and execute prompts with ease.
* **Quick Responses:** Run quick responses and personalize them to your needs.

![Prompt Editor Capture](https://raw.githubusercontent.com/dev2bit/prompt-editor/master/assets/img/capture.png)

## Getting Started
To begin using Prompt Editor, simply install the extension from the Chrome Web Store. Once installed, navigate to the ChatGPT page, where you will see the Prompt Editor interface integrated seamlessly into your browsing experience.

Explore the full potential of Prompt Editor by creating and editing prompts, personalizing instructions, and executing quick responses tailored to your needs. With Prompt Editor, managing prompts for language models like ChatGPT has never been easier.

Join us on our journey as we continue to develop and expand the capabilities of Prompt Editor to support more language models and improve your overall experience. Don't forget to star our GitHub repository and contribute to the project's growth!


## Configure Prompt Editor to store prompts in a GitHub repository.

### Create an empty repository on GitHub:
To create an empty repository on GitHub, follow these simple steps:
1. Sign up or log in to your GitHub account at https://github.com/.
2. Click on the "+" symbol in the top right corner of the screen and select "New repository".
3. Assign a name to the repository and, optionally, a description.
4. Choose whether you want the repository to be public or private. You will usually want it to be private so that not everyone has access to your personal or work team prompts.
5. Complete the options according to your preferences or do not select any additional options so that the repository is empty.
6. Click on "Create repository" to finish the process.

### Generate an API Token to access the repository:
To obtain an API Token that allows a Chrome extension to access your repository, follow these steps:
1. Go to your GitHub profile settings page by clicking on your profile picture in the top right corner and selecting "Settings".
2. In the left sidebar menu, select "Developer settings".
3. Next, select "Personal access tokens".
4. Click on "Generate new token".
5. Assign a descriptive name to the token, give it repository access, and select the Contents repo-scope for reading and writing.
6. Click on "Generate token" to create the token. Be sure to copy the generated token and store it in a safe place, as you will not be able to see it again.

### Obtain the Github Token, Github Owner, Github Repository, and Github Path:
Once you have created the repository and obtained the API Token, you will need the following information to interact with the repository from the extension:
1. Github Token: This is the personal access token you generated in step 2. Make sure to store it securely and not share it publicly.
2. Github Owner: This is the username of the GitHub account where the repository was created.
3. Github Repository: This is the name of the repository you created in step 1.
4. Github Path: This is the path within the repository where you want the extension to read or write files. If it is a repository only for this purpose, you can use the root directory "/".

### Configure Prompt Editor
1. Open the extension options from the toolbar button or from the extension manager.
2. Select Storage Type: GitHub
3. Complete the requested inputs with the data obtained in the previous step.

## Authors

Prompt Editor is a free and open-source software project developed by the team at dev2bit. Our mission is to improve work processes and provide a valuable tool to the community.

## Values
Our project is driven by the following values:

* Process improvement
* Non-profit orientation
* Community software
* GPL3 license

## Contributing
If you're interested in contributing to Prompt Editor, please get in touch with us at info@dev2bit.com. We welcome all contributions and feedback from the community.

## Logo
The logo for Prompt Editor was created using the [MidJourney](https://www.midjourney.com/) image generation model.

## About dev2bit
<p align="center">
  <img width="460" height="300" src="https://dev2bit.com/wp-content/themes/lovecraft_child/assets/icons/dev2bit_monitor2.svg">
</p>

[dev2bit](https://dev2bit.com/) is a software development company dedicated to providing innovative and high-quality solutions to our clients. Our team has extensive experience in software development, and we are committed to delivering exceptional results to our customers.

