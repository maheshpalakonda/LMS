pipeline {
    agent any

    tools {
        jdk 'java21'
        nodejs 'NodeJS'
    }

    environment {
        DOCKER_HUB_USER  = 'mahesh1925'
        BACKEND_IMAGE    = 'mahesh1925/lms-backend'
        FRONTEND_IMAGE   = 'mahesh1925/lms-frontend'
        COMPOSE_FILE     = 'docker-compose.yml'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/maheshpalakonda/lms-ci_cd.git',
                    credentialsId: 'github-pat'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "🏗️ Building Docker images..."
                    docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile.backend backend
                    docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile.frontend frontend
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "🔑 Logging into Docker Hub..."
                        echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:latest
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy Containers') {
            steps {
                withCredentials([
                    file(credentialsId: 'backend-env', variable: 'BACKEND_ENV'),
                    file(credentialsId: 'frontend-env', variable: 'FRONTEND_ENV')
                ]) {
                    sh '''
                        echo "🧩 Deploying containers..."
                        mkdir -p /app/lms
                        cp "$BACKEND_ENV" backend/.env
                        cp "$FRONTEND_ENV" frontend/.env
                        docker compose -f ${COMPOSE_FILE} down || true
                        docker compose -f ${COMPOSE_FILE} up -d --force-recreate --remove-orphans
                        echo "✅ Deployment completed!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deployment Successful!"
        }
        failure {
            echo "❌ Build Failed — Check Jenkins Logs."
        }
    }
}

