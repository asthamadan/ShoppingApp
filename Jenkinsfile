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
        DEPLOY_SERVER = 'your-deploy-server' // Replace with actual server
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: "${env.BRANCH_NAME}", credentialsId: 'github-credentials-id', url: 'https://github.com/asthamadan/ShoppingApp.git'
            }
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
        stage('Deploy') {
            when {
                anyOf { branch 'main'; branch 'develop' }
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh """
                            ssh -o StrictHostKeyChecking=no user@${DEPLOY_SERVER} << 'EOF'
                            docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}
                            docker stop myapp-prod || true
                            docker rm myapp-prod || true
                            docker run -d --name myapp-prod -p 80:3000 ${DOCKER_REGISTRY}/${IMAGE_NAME}
                            EOF
                        """
                    } else if (env.BRANCH_NAME == 'develop') {
                        sh """
                            ssh -o StrictHostKeyChecking=no user@${DEPLOY_SERVER} << 'EOF'
                            docker pull ${DOCKER_REGISTRY}/${IMAGE_NAME}
                            docker stop myapp-staging || true
                            docker rm myapp-staging || true
                            docker run -d --name myapp-staging -p 8080:3000 ${DOCKER_REGISTRY}/${IMAGE_NAME}
                            EOF
                        """
                    }
                }
            }
        }
    }
    post {
        success {
            script {
                sh """
                    curl -X POST -H 'Accept: application/vnd.github+json' \
                    -H 'Authorization: Bearer ${GITHUB_TOKEN}' \
                    -H 'X-GitHub-Api-Version: 2022-11-28' \
                    https://api.github.com/repos/asthamadan/Jenkins-Multibranch-Pipeline/statuses/${env.GIT_COMMIT} \
                    -d '{"state":"success","context":"ci/jenkins","description":"Build succeeded","target_url":"${env.BUILD_URL}"}'
                """
            }
        }
        failure {
            script {
                sh """
                    curl -X POST -H 'Accept: application/vnd.github+json' \
                    -H 'Authorization: Bearer ${GITHUB_TOKEN}' \
                    -H 'X-GitHub-Api-Version: 2022-11-28' \
                    https://api.github.com/repos/asthamadan/Jenkins-Multibranch-Pipeline/statuses/${env.GIT_COMMIT} \
                    -d '{"state":"failure","context":"ci/jenkins","description":"Build failed","target_url":"${env.BUILD_URL}"}'
                """
            }
        }
        always {
            sh 'docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME} || true'
        }
    }
}
