pipeline {
    agent {
        label 'Node1'
    }
    environment {
        DOCKER_REGISTRY = 'docker.io/amadan783'
        DOCKER_CREDENTIALS = credentials('docker-credentials-id')
        GIT_CREDENTIALS = credentials('github-credentials-id')
        GITHUB_TOKEN = credentials('github-token-id')
        IMAGE_NAME = "myapp:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
        
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: "${env.BRANCH_NAME}", credentialsId: 'github-credentials-id', url: 'https://github.com/asthamadan/ShoppingApp.git'
            }
        }
                     
        stage('Build') {
            steps {
                sh 'docker build -t ${DOCKER_REGISTRY}/${IMAGE_NAME} .'
            }
        }
        stage('Test') {
            when {
                anyOf { branch 'main'; branch 'develop' }
            }
            steps {
                sh 'docker run --rm ${DOCKER_REGISTRY}/${IMAGE_NAME} npm test'
            }
        }
        stage('Push to Registry') {
            when {
                anyOf { branch 'main'; branch 'develop' }
            }
            steps {
                sh 'echo $DOCKER_CREDENTIALS_PSW | docker login ${DOCKER_REGISTRY} --username $DOCKER_CREDENTIALS_USR --password-stdin'
                sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}'
            }
        }
        
            }
        }
       
