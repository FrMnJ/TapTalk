# TapTalk
TapTalk is a simple chat application built with React and Python WebSocket. It is similar to Omegle but based in text. It allow users to chat with random people. The application is designed to be easy to use and deploy, making it a great choice for anyone looking to add a chat feature to their website or application.

# Getting Started with TapTalk

This guide will walk you through deploying the TapTalk application using Kubernetes. The deployment includes the chat-service, Redis, and the TapTalk frontend.

## Prerequisites

1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/).
2. Install [Minikube](https://minikube.sigs.k8s.io/docs/start/) or have access to a Kubernetes cluster.
3. Ensure Docker is installed and running.
4. Clone the TapTalk repository to your local machine.

## Steps

### 1. Start Minikube (if using Minikube)
```bash
minikube start
```

### 2. Apply Kubernetes Manifests

Navigate to the `tap-talk-k8s` directory and apply the Kubernetes manifests:

```bash
cd tap-talk-k8s
kubectl apply -f chat-service-deployment.yaml
kubectl apply -f chat-service-service.yaml
kubectl apply -f taptalk-web-deployment.yaml
kubectl apply -f taptalk-web-service.yaml
kubectl apply -f taptalk-ingress.yaml
```

### 3. Verify Deployments and Services

Check the status of the deployments:
```bash
kubectl get deployments
```

Check the status of the services:
```bash
kubectl get services
```

### 4. Access the Application

If you are using Minikube, enable the ingress addon:
```bash
minikube addons enable ingress
```

Get the Minikube IP:
```bash
minikube ip
```

Add the following entry to your `/etc/hosts` file (replace `<minikube-ip>` with the IP from the previous command):
```
<minikube-ip> taptalk.net
```

Access the application in your browser at `http://taptalk.net`.

### 5. Clean Up

To delete the resources created, run:
```bash
kubectl delete -f chat-service-deployment.yaml
kubectl delete -f chat-service-service.yaml
kubectl delete -f taptalk-web-deployment.yaml
kubectl delete -f taptalk-web-service.yaml
kubectl delete -f taptalk-ingress.yaml
```

## Notes

- Ensure that the `taptalk-ingress.yaml` file is configured correctly for your environment.
