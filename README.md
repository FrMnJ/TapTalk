# TapTalk
TapTalk is a simple chat application built with React and Python WebSocket. It is similar to Omegle but based in text. It allow users to chat with random people. The application is designed to be easy to use and deploy.

# Getting Started with TapTalk

This guide will walk you through deploying the TapTalk application using Kubernetes. The deployment includes the chat-service, Redis, and the TapTalk frontend.

## Prerequisites

1. Install [kubectl](https://kubernetes.io/docs/tasks/tools/).
2. Install [Minikube](https://minikube.sigs.k8s.io/docs/start/) or have access to a Kubernetes cluster.
3. Install [Istio](https://istio.io/latest/docs/setup/getting-started/#download) for monitoring.
4. Ensure Docker is installed and running.
5. Clone the TapTalk repository to your local machine.

## Steps

### 1. Start Minikube (if using Minikube)
```bash
minikube start
```

### 2. Install a demo of Istio
```bash
istioctl install --set profile=demo -y
```

### 3. Add a label for Istio injection
```bash
kubectl label namespace default istio-injection=enabled
```

### 4. Apply Kubernetes Manifests

Navigate to the `tap-talk-k8s` directory and apply the Kubernetes manifests:

```bash
cd tap-talk-k8s
kubectl apply -f chat-service-deployment.yaml
kubectl apply -f chat-service-service.yaml
kubectl apply -f taptalk-web-deployment.yaml
kubectl apply -f taptalk-web-service.yaml
kubectl apply -f taptalk-ingress.yaml
kubectl apply -f taptalk-censor-deployment.yaml
kubectl apply -f taptalk-censor-hpa.yaml
kubectl apply -f chat-service-hpa.yaml
kubectl apply -f taptalk-web-hpa.yaml
kubectl apply -f taptalk-question-deployment.yaml
kubectl apply -f taptalk-question-service.yaml
kubectl apply -f taptalk-question-hpa.yaml
```

### 5. Verify Deployments and Services

Check the status of the deployments:
```bash
kubectl get deployments
```

Check the status of the services:
```bash
kubectl get services
```

### 6. Access the Application

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
<minikube-ip> taptalk.tech
```

Access the application in your browser at `http://taptalk.tech`.

### 7. Opening for services
In one terminal:
```bash
kubectl port-forward service/chat-service 8765:8765
```
Other terminal
```bash
 minikube tunnel -c
```

### 8. Open kiali dashboard
```
istioctl dashboard kiali
```
If kiali wasn't install run  and run again the above:
```
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.26/samples/addons/kiali.
yaml
```

#### Preview Istio
![image](https://github.com/user-attachments/assets/a3eb0bc4-b7b5-4af3-a43c-b404141b6ed5)


### 9. Clean Up

To delete the resources created, run:
```bash
kubectl delete -f chat-service-deployment.yaml
kubectl delete -f chat-service-service.yaml
kubectl delete -f taptalk-web-deployment.yaml
kubectl delete -f taptalk-web-service.yaml
kubectl delete -f taptalk-ingress.yaml
kubectl delete -f taptalk-censor-deployment.yaml
kubectl delete -f taptalk-censor-hpa.yaml
kubectl delete -f chat-service-hpa.yaml
kubectl delete -f taptalk-web-hpa.yaml
kubectl delete -f taptalk-question-deployment.yaml
kubectl delete -f taptalk-question-service.yaml
kubectl delete -f taptalk-question-hpa.yaml
```

### Deploy Azure
```bash
az login
az group create --name taptalk-rg --location eastus
az aks create --resource-group taptalk-rg --name taptalk-aks --node-count 1 --node-vm-size Standard_B2s --generate-ssh-keys
az aks get-credentials --resource-group taptalk-rg --name taptalk-aks
istioctl install --set profile=demo -y
kubectl label namespace default istio-injection=enabled
az aks get-credentials --resource-group taptalk-rg --name taptalk-aks --overwrite-existing
kubectl apply -f tap-talk-k8s/
```

## Notes

- Both `chat-service` and `taptalk-web` deployments now include resource requests and limits for CPU and memory.
- Horizontal Pod Autoscalers (HPA) are configured for both services. See `chat-service-hpa.yaml` and `taptalk-web-hpa.yaml` in the `tap-talk-k8s` directory.
- Ensure that the `taptalk-ingress.yaml` file is configured correctly for your environment.

## Contributing

We welcome contributions to TapTalk! If you have an idea for a new feature, bug fix, or improvement, please follow these steps:

1. Fork the repository and create a new branch for your changes.
2. Make your changes and ensure they are well-tested.
3. Submit a pull request with a clear description of your changes and the problem they solve.

### Guidelines

- Follow the existing code style and structure.
- Write clear and concise commit messages.
- Ensure your code passes all tests and linting checks.

Thank you for contributing to TapTalk!
