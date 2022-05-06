# Code Tracker
A Solution Architect Tool for tracking projects Links, Pull Requests, Wiki Designs and Jira Tickets

React application used for training/demo purpose only, not production ready code. 

The links Dashboard allow you to define quick links for fast access and access your pages in single click.

<p align="center">
  <img src="https://raw.githubusercontent.com/nabil/code-tracker/main/content/images/links.jpg">
</p>

Once you configure a code repository in the Settings, you can start reviewing your pull requests from differents providers. 

<p align="center">
  <img src="https://raw.githubusercontent.com/nabil/code-tracker/main/content/images/pull_requests.jpg">
</p>

Currently the demo support Bitbucket, Gitlab and Github.

# Where to start

You first need to clonse the repository, then you can run the demo locally as follow:

````sh
git clone https://github.com/nabil/code-tracker.git && cd code-tracker
yarn install
yarn start
````

Then open your browser at http://127.0.0.1:3008

If you want to use the demo container, you can build the image and run it as follow:

````sh
docker build -t io.github.nabil/code-tracker .
docker run -p 80:80 io.github.nabil/code-tracker
````

Or if you have a running Kubernetes cluster, you can apply the configuration

````sh
kubectl apply -f k8s
````