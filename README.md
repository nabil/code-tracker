# Code Tracker
A Solution Architect Tool for tracking projects Links, Pull Requests, Wiki Designs and Jira Tickets.

Built with React and Semantic-UI, this app is for demo purpose only, not production ready. 

The links Dashboard allow you to CRUD links or import and export links files per project.

<p align="center">
  <img width="888" src="https://github.com/nabil/code-tracker/raw/main/content/images/links.jpg">
</p>

Once you configure a code repository in the Settings, you can start reviewing your pull requests from differents providers. 

<p align="center">
  <img width="888" src="https://github.com/nabil/code-tracker/raw/main/content/images/pull_requests.jpg">
</p>

Currently the demo support Bitbucket, Gitlab and Github and you can try it [here](https://nabil.github.io/code-tracker/). 

Pending to be added: Metrics Filter for (Github and Gitlab), Wiki Pages and Tickets, see full [ToDo Task List](https://github.com/nabil/code-tracker/issues/1).

You can try the demo [here](https://nabil.github.io/code-tracker/) or use it as a playground for testing, se how-to do it below.

# Where to start

You first need to clone the repository, then you can run the demo locally as follow:

````sh
git clone https://github.com/nabil/code-tracker.git && cd code-tracker
npm install
npm run start
````

Then open your browser at http://127.0.0.1:3008/code-tracker

If you want to use the demo container, you can build the image and run it as follow:

````sh
docker build -t io.github.nabil/code-tracker .
docker run -p 80:80 io.github.nabil/code-tracker
````

Or if you have a running Kubernetes cluster, you can apply the configuration

````sh
kubectl apply -f k8s
````